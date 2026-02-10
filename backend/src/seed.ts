import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { AdminsService } from './admins/admins.service';
import { OffersService } from './offers/offers.service';
import { VisitorsService } from './visitors/visitors.service';
import { OrdersService } from './orders/orders.service';
import { ClientsService } from './clients/clients.service';
import { PaymentsService } from './payments/payments.service';
import { AdminRole } from './common/enums/admin-role.enum';
import { OfferStatus } from './common/enums/offer-status.enum';
import { VisitorStatus } from './common/enums/visitor-status.enum';
import { OrderStatus } from './common/enums/order-status.enum';
import { PaymentStatus } from './common/enums/payment-status.enum';
import { PaymentMethod } from './common/enums/payment-method.enum';

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.create(AppModule);

  const adminsService = app.get(AdminsService);
  const offersService = app.get(OffersService);
  const visitorsService = app.get(VisitorsService);
  const ordersService = app.get(OrdersService);
  const clientsService = app.get(ClientsService);
  const paymentsService = app.get(PaymentsService);

  try {
    // Check if data already exists by trying to find the super admin
    console.log('🔍 Checking for existing data...');
    let dataExists = false;
    try {
      const testAdmin = await adminsService.findByEmail('admin@bensaoud.com');
      if (testAdmin) {
        dataExists = true;
      }
    } catch (error) {
      // Admin doesn't exist, proceed with seeding
      dataExists = false;
    }

    if (dataExists) {
      console.log('⚠️  Database already contains seed data!');
      console.log('   Skipping seeding to avoid conflicts.\n');
      console.log('💡 To re-seed, manually clear the database tables first.');
      console.log('   Or drop and recreate the database.\n');
      console.log('✅ Use existing credentials:');
      console.log('   Email: admin@bensaoud.com');
      console.log('   Password: admin123\n');
      return;
    }

    console.log('✓ No existing data found, proceeding with seeding...\n');

    // 1. Create Admins
    console.log('📝 Creating admins...');
    const superAdmin = await adminsService.create({
      name: 'Super Admin',
      email: 'admin@bensaoud.com',
      password: 'admin123',
      role: AdminRole.SUPER_ADMIN,
    });
    const regularAdmin = await adminsService.create({
      name: 'John Doe',
      email: 'john@bensaoud.com',
      password: 'admin123',
      role: AdminRole.ADMIN,
    });
    console.log(`✓ Created ${2} admins\n`);

    // 2. Create Offers
    console.log('📝 Creating offers...');
    const offers = await Promise.all([
      offersService.create({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        km: 45000,
        price: 18000,
        location: 'Algiers',
        ownerName: 'Ahmed Benali',
        ownerPhone: '0555123456',
        status: OfferStatus.AVAILABLE,
      }),
      offersService.create({
        brand: 'Hyundai',
        model: 'Tucson',
        year: 2021,
        km: 30000,
        price: 25000,
        location: 'Oran',
        ownerName: 'Fatima Mansouri',
        ownerPhone: '0555234567',
        status: OfferStatus.AVAILABLE,
      }),
      offersService.create({
        brand: 'Renault',
        model: 'Clio',
        year: 2019,
        km: 60000,
        price: 12000,
        location: 'Constantine',
        ownerName: 'Karim Ziani',
        ownerPhone: '0555345678',
        status: OfferStatus.AVAILABLE, // Changed from RESERVED to avoid conflicts
      }),
      offersService.create({
        brand: 'Peugeot',
        model: '208',
        year: 2022,
        km: 15000,
        price: 16000,
        location: 'Algiers',
        ownerName: 'Samia Touati',
        ownerPhone: '0555456789',
        status: OfferStatus.AVAILABLE, // Changed from SOLD to avoid conflicts
      }),
      offersService.create({
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        km: 40000,
        price: 22000,
        location: 'Tlemcen',
        ownerName: 'Yacine Belkacem',
        ownerPhone: '0555567890',
        status: OfferStatus.AVAILABLE,
      }),
    ]);
    console.log(`✓ Created ${offers.length} offers\n`);

    // 3. Create Visitors
    console.log('📝 Creating visitors...');
    const visitors = await Promise.all([
      visitorsService.create({
        name: 'Mohamed Amri',
        phone: '0666111222',
        email: 'mohamed@example.com',
        carBrand: 'Toyota',
        carModel: 'Corolla',
        budget: 18000,
        status: VisitorStatus.NEW,
      }),
      visitorsService.create({
        name: 'Nadia Khelifi',
        phone: '0666222333',
        carBrand: 'Hyundai',
        carModel: 'Tucson',
        budget: 25000,
        remarks: 'Interested in SUVs',
        status: VisitorStatus.CONTACTED,
      }),
      visitorsService.create({
        name: 'Rachid Bouazza',
        phone: '0666333444',
        email: 'rachid@example.com',
        carBrand: 'Renault',
        carModel: 'Clio',
        budget: 12000,
        status: VisitorStatus.NEW,
      }),
      visitorsService.create({
        name: 'Leila Hammadi',
        phone: '0666444555',
        carBrand: 'Peugeot',
        carModel: '208',
        budget: 16000,
        status: VisitorStatus.NEW,
      }),
    ]);
    console.log(`✓ Created ${visitors.length} visitors\n`);

    // 4. Create Orders (these will change offer and visitor statuses)
    console.log('📝 Creating orders...');
    const orders = await Promise.all([
      ordersService.create({
        offerId: offers[2].id, // Renault Clio (will become RESERVED)
        visitorId: visitors[2].id, // Rachid Bouazza (will become MATCHED)
        clientName: 'Rachid Bouazza',
        clientPhone: '0666333444',
        clientEmail: 'rachid@example.com',
        agreedPrice: 11500,
        deposit: 2000,
        profit: 500,
        status: OrderStatus.PENDING,
      }),
      ordersService.create({
        offerId: offers[3].id, // Peugeot 208 (will become RESERVED then can be completed)
        visitorId: visitors[3].id, // Leila Hammadi
        clientName: 'Leila Hammadi',
        clientPhone: '0666444555',
        agreedPrice: 16000,
        deposit: 5000,
        profit: 1000,
        status: OrderStatus.PENDING,
      }),
    ]);
    console.log(`✓ Created ${orders.length} orders\n`);

    // 5. Complete the second order to demonstrate workflow
    console.log('📝 Confirming and completing second order...');
    await ordersService.confirmOrder(orders[1].id);
    await ordersService.completeOrder(orders[1].id);
    console.log('✓ Order completed (offer now SOLD, visitor now CONVERTED)\n');

    // 6. Create Clients
    console.log('📝 Creating clients...');
    const clients = await Promise.all([
      clientsService.create({
        name: 'Leila Hammadi',
        phone: '0666444555',
        email: 'leila@example.com',
        address: '15 Rue Didouche Mourad, Algiers',
        totalSpent: 16000,
        remainingBalance: 11000,
        notes: 'Excellent customer, paid deposit on time',
      }),
      clientsService.create({
        name: 'Omar Belaid',
        phone: '0666555666',
        email: 'omar@example.com',
        address: '22 Boulevard de la Revolution, Oran',
        totalSpent: 25000,
        remainingBalance: 0,
        notes: 'Paid in full',
      }),
    ]);
    console.log(`✓ Created ${clients.length} clients\n`);

    // 7. Create Payments
    console.log('📝 Creating payments...');
    const payments = await Promise.all([
      paymentsService.create({
        orderId: orders[1].id,
        clientId: clients[0].id,
        amount: 5000,
        method: PaymentMethod.CASH,
        status: PaymentStatus.PAID,
        notes: 'Initial deposit',
      }),
      paymentsService.create({
        orderId: orders[1].id,
        clientId: clients[0].id,
        amount: 11000,
        method: PaymentMethod.TRANSFER,
        status: PaymentStatus.UNPAID,
        notes: 'Remaining balance',
      }),
    ]);
    console.log(`✓ Created ${payments.length} payments\n`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admins: ${2}`);
    console.log(`   - Offers: ${offers.length}`);
    console.log(`   - Visitors: ${visitors.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Clients: ${clients.length}`);
    console.log(`   - Payments: ${payments.length}`);
    console.log('\n💡 Login credentials:');
    console.log('   Email: admin@bensaoud.com');
    console.log('   Password: admin123\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
