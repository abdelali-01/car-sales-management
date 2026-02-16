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
      this.offersRepository.createQueryBuilder('offer').where('LOWER(offer.status::text) = LOWER(:status)', { status: OfferStatus.AVAILABLE }).getCount(),
      this.offersRepository.createQueryBuilder('offer').where('LOWER(offer.status::text) = LOWER(:status)', { status: OfferStatus.SOLD }).getCount(),
      this.visitorsRepository.count(),
      this.ordersRepository.count(),
      this.ordersRepository.createQueryBuilder('order').where('LOWER("order".status::text) = LOWER(:status)', { status: OrderStatus.PENDING }).getCount(),
      this.ordersRepository.createQueryBuilder('order').where('LOWER("order".status::text) = LOWER(:status)', { status: OrderStatus.COMPLETED }).getCount(),
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
      .addSelect('SUM(order.profit)', 'profit')
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
      profit: 0,
    }));

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.month) - 1;
      monthlyData[monthIndex] = {
        month: parseInt(sale.month),
        count: parseInt(sale.count),
        revenue: parseFloat(sale.revenue) || 0,
        profit: parseFloat(sale.profit) || 0,
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

  async getOrdersByStatus() {
    const statuses = Object.values(OrderStatus);
    const counts = await Promise.all(
      statuses.map((status) =>
        this.ordersRepository.count({ where: { status } }),
      ),
    );

    // Convert to object for easier consumption { pending: 10, confirmed: 5, ... }
    const distribution = {};
    statuses.forEach((status, index) => {
      distribution[status] = counts[index];
    });

    return distribution;
  }

  async getPopularCars(limit: number = 5) {
    // 1. Fetch all ordered cars (brand & model) from orders that have an orderedCar
    // We only care about orders that HAVE an orderedCar entity linked
    const rawCars = await this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.orderedCar', 'car')
      .select('car.brand', 'brand')
      .addSelect('car.model', 'model')
      .getRawMany();

    // User Update: "the popular car displaying only the ordered_card do not include offers cars"
    // So we ONLY use rawCars (from ordered_cars table)

    const allCars = [
      ...rawCars
    ];

    // 2. Fuzzy match / Normalize
    const normalizedCounts: Record<string, { name: string; count: number; brand: string; model: string }> = {};

    const normalize = (str: string) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

    allCars.forEach(car => {
      if (!car.brand || !car.model) return;

      const key = normalize(car.brand) + '_' + normalize(car.model);

      // Simple heuristic: keep the first "display name" encountered for this key, or find a better one
      if (!normalizedCounts[key]) {
        normalizedCounts[key] = {
          name: `${car.brand} ${car.model}`, // First one wins for display
          brand: car.brand,
          model: car.model,
          count: 0
        };
      }
      normalizedCounts[key].count++;
    });

    // 3. Sort and limit
    const sorted = Object.values(normalizedCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sorted;
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
      // Payment entity does not have a status column. Assuming all payments are valid/paid.
      // If we need to filter, we might need to check the associated Order status, but payments are usually 'real' money.
      // .where('payment.status = :status', { status: PaymentStatus.PAID })
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
