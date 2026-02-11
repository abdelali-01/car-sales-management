import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../offers/entities/offer.entity';
import { Visitor } from '../visitors/entities/visitor.entity';
import { Order } from '../orders/entities/order.entity';
import { Client } from '../clients/entities/client.entity';
import { Payment } from '../payments/entities/payment.entity';
import { OfferStatus } from '../common/enums/offer-status.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Visitor)
    private visitorsRepository: Repository<Visitor>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) { }

  async getOverview() {
    const [
      totalOffers,
      availableOffers,
      soldOffers,
      totalVisitors,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalClients,
    ] = await Promise.all([
      this.offersRepository.count(),
      this.offersRepository.count({ where: { status: OfferStatus.AVAILABLE } }),
      this.offersRepository.count({ where: { status: OfferStatus.SOLD } }),
      this.visitorsRepository.count(),
      this.ordersRepository.count(),
      this.ordersRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.ordersRepository.count({ where: { status: OrderStatus.COMPLETED } }),
      this.clientsRepository.count(),
    ]);

    return {
      offers: {
        total: totalOffers,
        available: availableOffers,
        sold: soldOffers,
      },
      visitors: {
        total: totalVisitors,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
      },
      clients: {
        total: totalClients,
      },
    };
  }

  async getMonthlySales(year?: number) {
    const targetYear = year || new Date().getFullYear();

    const sales = await this.ordersRepository
      .createQueryBuilder('order')
      .select('EXTRACT(MONTH FROM order.created_at)', 'month')
      .addSelect('COUNT(order.id)', 'count')
      .addSelect('SUM(order.agreed_price)', 'revenue')
      .where('EXTRACT(YEAR FROM order.created_at) = :year', {
        year: targetYear,
      })
      .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
      .groupBy('EXTRACT(MONTH FROM order.created_at)')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Format the results to include all 12 months
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
      revenue: 0,
    }));

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.month) - 1;
      monthlyData[monthIndex] = {
        month: parseInt(sale.month),
        count: parseInt(sale.count),
        revenue: parseFloat(sale.revenue) || 0,
      };
    });

    return { year: targetYear, data: monthlyData };
  }

  async getConversionRate() {
    const totalVisitors = await this.visitorsRepository.count();
    const totalClients = await this.clientsRepository.count();

    const conversionRate =
      totalVisitors > 0 ? (totalClients / totalVisitors) * 100 : 0;

    return {
      totalVisitors,
      totalClients,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  }

  async getOffersByStatus() {
    const statuses = Object.values(OfferStatus);
    const counts = await Promise.all(
      statuses.map((status) =>
        this.offersRepository.count({ where: { status } }),
      ),
    );

    return statuses.map((status, index) => ({
      status,
      count: counts[index],
    }));
  }

  async getRevenue() {
    const completedOrders = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.agreed_price)', 'totalRevenue')
      .addSelect('SUM(order.deposit)', 'totalDeposits')
      .addSelect('SUM(order.profit)', 'totalProfit')
      .where('order.status = :status', { status: OrderStatus.COMPLETED })
      .getRawOne();

    const paidPayments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalPaid')
      .where('payment.status = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    const totalRevenue = parseFloat(completedOrders?.totalRevenue) || 0;
    const totalDeposits = parseFloat(completedOrders?.totalDeposits) || 0;
    const totalProfit = parseFloat(completedOrders?.totalProfit) || 0;
    const totalPaid = parseFloat(paidPayments?.totalPaid) || 0;
    const outstandingBalance = totalRevenue - totalPaid;

    return {
      totalRevenue,
      totalDeposits,
      totalProfit,
      totalPaid,
      outstandingBalance,
    };
  }

  async getRecentActivity(limit: number = 10) {
    const recentOrders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.offer', 'offer')
      .orderBy('order.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    const recentVisitors = await this.visitorsRepository
      .createQueryBuilder('visitor')
      .orderBy('visitor.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    const recentPayments = await this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .orderBy('payment.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return {
      recentOrders,
      recentVisitors,
      recentPayments,
    };
  }
}
