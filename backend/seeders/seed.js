const bcrypt = require('bcrypt');
const db = require('../config/db');

const seedDatabase = async () => {
  console.log('Seeding database...');

  try {
    // 1. Clean existing records in correct order to avoid FK errors
    console.log('Clearing old data...');
    await db.execute('DELETE FROM payments');
    await db.execute('DELETE FROM appointments');
    await db.execute('DELETE FROM testimonials');
    await db.execute('DELETE FROM messages');
    await db.execute('DELETE FROM users');
    await db.execute('DELETE FROM services');
    await db.execute('DELETE FROM doctors');

    // 2. Insert Admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrator Ficky Busuk', 'admin@fickybusuk.com', hashedPassword, 'admin']
    );

    // 3. Insert Services (8 items)
    console.log('Inserting services...');
    const services = [
      {
        name: 'Pemeriksaan Kesehatan',
        description: 'Pemeriksaan kesehatan fisik menyeluruh untuk memastikan hewan kesayangan Anda tetap bugar dan mendeteksi gejala penyakit secara dini.',
        price: 75000.00,
        icon: 'Stethoscope',
        status: 'active'
      },
      {
        name: 'Vaksinasi',
        description: 'Pemberian vaksin lengkap (F3, F4, Rabies, dll.) untuk melindungi anjing dan kucing dari berbagai virus berbahaya.',
        price: 150000.00,
        icon: 'Syringe',
        status: 'active'
      },
      {
        name: 'Grooming',
        description: 'Perawatan kebersihan bulu, pemotongan kuku, pembersihan telinga, dan mandi antibakteri/kutu agar hewan peliharaan wangi dan bersih.',
        price: 85000.00,
        icon: 'Scissors',
        status: 'active'
      },
      {
        name: 'Sterilisasi',
        description: 'Operasi sterilisasi (kebiri/ovariohisterektomi) untuk mengontrol populasi serta menjaga perilaku dan kesehatan reproduksi.',
        price: 450000.00,
        icon: 'ShieldAlert',
        status: 'active'
      },
      {
        name: 'Perawatan Gigi',
        description: 'Pembersihan karang gigi (scaling) dan penanganan masalah gigi/gusi hewan peliharaan agar mulut sehat dan bebas bau.',
        price: 200000.00,
        icon: 'Smile',
        status: 'active'
      },
      {
        name: 'Konsultasi Nutrisi',
        description: 'Diskusi mengenai berat badan ideal, diet seimbang, dan pilihan makanan yang cocok berdasarkan kondisi medis hewan Anda.',
        price: 60000.00,
        icon: 'Apple',
        status: 'active'
      },
      {
        name: 'Pemeriksaan Kulit',
        description: 'Diagnosis dan pengobatan infeksi jamur, scabies, alergi, kutu, serta kerontokan bulu pada hewan kesayangan.',
        price: 90000.00,
        icon: 'Sparkles',
        status: 'active'
      },
      {
        name: 'Rawat Jalan',
        description: 'Pemberian obat-obatan rutin, terapi cairan, dan kontrol kesehatan berkala bagi hewan peliharaan yang tidak membutuhkan rawat inap.',
        price: 50000.00,
        icon: 'Activity',
        status: 'active'
      }
    ];

    for (const service of services) {
      await db.execute(
        'INSERT INTO services (name, description, price, icon, status) VALUES (?, ?, ?, ?, ?)',
        [service.name, service.description, service.price, service.icon, service.status]
      );
    }

    // 4. Insert Doctors (4 items)
    console.log('Inserting doctors...');
    const doctors = [
      {
        name: 'drh. Andi Pratama',
        specialization: 'Dokter Hewan Umum',
        experience: '5 Tahun',
        schedule: 'Senin - Rabu, 08:00 - 15:00',
        image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
        status: 'available'
      },
      {
        name: 'drh. Sinta Amelia',
        specialization: 'Spesialis Kucing (Feline Medicine)',
        experience: '4 Tahun',
        schedule: 'Kamis - Sabtu, 12:00 - 18:00',
        image_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=200&auto=format&fit=crop',
        status: 'available'
      },
      {
        name: 'drh. Bima Nugraha',
        specialization: 'Spesialis Bedah Minor & Mayor',
        experience: '7 Tahun',
        schedule: 'Senin - Jumat, 15:00 - 20:00',
        image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop',
        status: 'available'
      },
      {
        name: 'drh. Rara Putri',
        specialization: 'Konsultan Nutrisi & Perilaku Hewan',
        experience: '3 Tahun',
        schedule: 'Sabtu - Minggu, 09:00 - 15:00',
        image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
        status: 'available'
      }
    ];

    for (const doc of doctors) {
      await db.execute(
        'INSERT INTO doctors (name, specialization, experience, schedule, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
        [doc.name, doc.specialization, doc.experience, doc.schedule, doc.image_url, doc.status]
      );
    }

    // 5. Insert Testimonials (3 items)
    console.log('Inserting testimonials...');
    const testimonials = [
      {
        customer_name: 'Budi Santoso',
        pet_name: 'Milo (Kucing)',
        comment: 'Klinik Ficky Busuk bersih sekali. drh. Sinta ramah banget waktu menangani Milo yang sedang demam. Sekarang Milo sudah aktif kembali!',
        rating: 5
      },
      {
        customer_name: 'Dewi Lestari',
        pet_name: 'Kiko (Anjing Pomeranian)',
        comment: 'Layanan grooming-nya sangat memuaskan, bulu Kiko jadi wangi, halus, dan bebas kutu. Harganya juga bersahabat dibanding tempat lain.',
        rating: 5
      },
      {
        customer_name: 'Rian Wijaya',
        pet_name: 'Blacky (Kucing Kampung)',
        comment: 'Sangat terbantu dengan sistem reservasi online. Waktu datang tidak perlu antre lama, penanganan bedah luka sterilnya rapi sekali.',
        rating: 4
      }
    ];

    for (const t of testimonials) {
      await db.execute(
        'INSERT INTO testimonials (customer_name, pet_name, comment, rating, is_visible) VALUES (?, ?, ?, ?, TRUE)',
        [t.customer_name, t.pet_name, t.comment, t.rating]
      );
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
