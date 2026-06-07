import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb://localhost:27017/medical-app';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// ── Schemas (inline, matching your app schemas) ──────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    profileImage: { type: String, default: null },
    refreshToken: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const DoctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialty: String,
    bio: String,
    phone: String,
    address: String,
    rating: { type: Number, default: 0 },
    consultationPrice: Number,
    symptoms: [String],
    services: [String],
    availability: [{ day: String, from: String, to: String }],
    sessionDuration: { type: Number, default: 20 },
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const AppointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: String,
  },
  { timestamps: true },
);

const ReviewSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: mongoose.Types.ObjectId, ref: 'Appointment', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true },
);

// ── Models ───────────────────────────────────────────────────────────────────

const User = mongoose.model('User', UserSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const Review = mongoose.model('Review', ReviewSchema);

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomDate(monthsAgo: number): string {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - monthsAgo);
  const diff = now.getTime() - past.getTime();
  const d = new Date(past.getTime() + Math.random() * diff);
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function randomTime(): string {
  const hours = Math.floor(Math.random() * 8) + 9; // 9 AM - 4 PM
  const minutes = Math.random() > 0.5 ? '00' : '30';
  const h = hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${h.toString().padStart(2, '0')}:${minutes} ${period}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Seed Data ────────────────────────────────────────────────────────────────

const doctorsData = [
  { name: 'Dr Ahmed Hassan', email: 'ahmed.hassan@med.com', specialty: 'Cardiology', bio: 'Senior cardiologist with 15 years experience', phone: '01012345678', address: 'Cairo, Nasr City', consultationPrice: 300, symptoms: ['chest pain', 'shortness of breath'], services: ['ECG', 'Echocardiography'] },
  { name: 'Dr Sara Mohamed', email: 'sara.mohamed@med.com', specialty: 'Dermatology', bio: 'Dermatology specialist focusing on cosmetic procedures', phone: '01123456789', address: 'Giza, Dokki', consultationPrice: 250, symptoms: ['skin rash', 'acne'], services: ['Laser Treatment', 'Chemical Peels'] },
  { name: 'Dr Omar Ali', email: 'omar.ali@med.com', specialty: 'Orthopedics', bio: 'Expert in joint and bone disorders', phone: '01234567890', address: 'Alexandria, Smouha', consultationPrice: 350, symptoms: ['back pain', 'joint stiffness'], services: ['X-Ray', 'Physical Therapy'] },
  { name: 'Dr Mona Ibrahim', email: 'mona.ibrahim@med.com', specialty: 'Pediatrics', bio: 'Pediatrician specialized in newborn care', phone: '01098765432', address: 'Cairo, Maadi', consultationPrice: 200, symptoms: ['fever', 'cough'], services: ['Vaccination', 'Growth Monitoring'] },
  { name: 'Dr Khaled Youssef', email: 'khaled.youssef@med.com', specialty: 'ENT', bio: 'ENT surgeon with 10 years experience', phone: '01187654321', address: 'Mansoura, Downtown', consultationPrice: 280, symptoms: ['ear pain', 'sore throat'], services: ['Hearing Test', 'Tonsillectomy'] },
];

const patientsData = [
  { name: 'Ali Mahmoud', email: 'ali.patient@test.com' },
  { name: 'Fatma Nour', email: 'fatma.patient@test.com' },
  { name: 'Youssef Samir', email: 'youssef.patient@test.com' },
  { name: 'Nada Ehab', email: 'nada.patient@test.com' },
  { name: 'Hassan Tarek', email: 'hassan.patient@test.com' },
];

const reviewComments = [
  'Excellent doctor, very professional!',
  'Great experience, highly recommended.',
  'Good consultation but long waiting time.',
  'Very kind and thorough examination.',
  'Average experience, could be better.',
  'The best doctor I have visited!',
  'Professional and caring.',
  'Quick diagnosis and effective treatment.',
];

// ── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!\n');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Appointment.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('✅ Cleared!\n');

  const hashedPassword = await bcrypt.hash('Test@1234', 10);

  // ── 1. Create Admin ──────────────────────────────────────────────────────
  console.log('👤 Creating admin user...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@medibook.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
  });
  console.log(`   ✅ Admin: ${admin.email}\n`);

  // ── 2. Create Doctor Users + Doctor Profiles ─────────────────────────────
  console.log('🩺 Creating doctors...');
  const doctorDocs: any[] = [];
  const doctorUsers: any[] = [];

  for (const doc of doctorsData) {
    const user = await User.create({
      name: doc.name,
      email: doc.email,
      password: hashedPassword,
      role: 'doctor',
      isActive: true,
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialty: doc.specialty,
      bio: doc.bio,
      phone: doc.phone,
      address: doc.address,
      consultationPrice: doc.consultationPrice,
      symptoms: doc.symptoms,
      services: doc.services,
      availability: [
        { day: 'Sunday', from: '09:00 AM', to: '03:00 PM' },
        { day: 'Tuesday', from: '10:00 AM', to: '04:00 PM' },
        { day: 'Thursday', from: '09:00 AM', to: '02:00 PM' },
      ],
      sessionDuration: 20,
      isApproved: true,
      isActive: true,
    });

    doctorDocs.push(doctor);
    doctorUsers.push(user);
    console.log(`   ✅ ${doc.name} (${doc.specialty}) - Doctor ID: ${doctor._id}`);
  }
  console.log();

  // ── 3. Create Patients ───────────────────────────────────────────────────
  console.log('🏥 Creating patients...');
  const patientUsers: any[] = [];

  for (const p of patientsData) {
    const user = await User.create({
      name: p.name,
      email: p.email,
      password: hashedPassword,
      role: 'patient',
      isActive: true,
    });
    patientUsers.push(user);
    console.log(`   ✅ ${p.name} (${p.email})`);
  }
  console.log();

  // ── 4. Create Appointments (30 total, spread across 6 months) ────────────
  console.log('📅 Creating appointments...');
  const statuses: AppointmentStatus[] = ['completed', 'completed', 'completed', 'pending', 'confirmed', 'cancelled'];
  // Weighted: more "completed" so top-doctors aggregation has data
  const appointments: any[] = [];

  // Give first doctor 10 completed appointments (to be the "top doctor")
  for (let i = 0; i < 10; i++) {
    const appt = await Appointment.create({
      patient: pick(patientUsers)._id,
      doctor: doctorDocs[0]._id,
      date: randomDate(6),
      time: randomTime(),
      status: 'completed',
    });
    appointments.push(appt);
  }

  // Give second doctor 7 completed
  for (let i = 0; i < 7; i++) {
    const appt = await Appointment.create({
      patient: pick(patientUsers)._id,
      doctor: doctorDocs[1]._id,
      date: randomDate(6),
      time: randomTime(),
      status: 'completed',
    });
    appointments.push(appt);
  }

  // Give third doctor 5 completed
  for (let i = 0; i < 5; i++) {
    const appt = await Appointment.create({
      patient: pick(patientUsers)._id,
      doctor: doctorDocs[2]._id,
      date: randomDate(6),
      time: randomTime(),
      status: 'completed',
    });
    appointments.push(appt);
  }

  // Remaining appointments spread across all doctors with mixed statuses
  for (let i = 0; i < 13; i++) {
    const appt = await Appointment.create({
      patient: pick(patientUsers)._id,
      doctor: pick(doctorDocs)._id,
      date: randomDate(6),
      time: randomTime(),
      status: pick(statuses),
    });
    appointments.push(appt);
  }

  console.log(`   ✅ Created ${appointments.length} appointments\n`);

  // ── 5. Create Reviews (for completed appointments) ────────────────────────
  console.log('⭐ Creating reviews...');
  const completedAppts = appointments.filter(a => a.status === 'completed');
  let reviewCount = 0;

  for (let i = 0; i < Math.min(15, completedAppts.length); i++) {
    const appt = completedAppts[i];
    await Review.create({
      patient: appt.patient,
      doctor: appt.doctor,
      appointment: appt._id,
      rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
      comment: pick(reviewComments),
    });
    reviewCount++;
  }
  console.log(`   ✅ Created ${reviewCount} reviews\n`);

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════');
  console.log('  🎉  SEED COMPLETE!  Test Data Summary:');
  console.log('═══════════════════════════════════════════════');
  console.log(`  👤 Admin:    admin@medibook.com`);
  console.log(`  🩺 Doctors:  ${doctorDocs.length}`);
  console.log(`  🏥 Patients: ${patientUsers.length}`);
  console.log(`  📅 Appointments: ${appointments.length}`);
  console.log(`  ⭐ Reviews:  ${reviewCount}`);
  console.log('───────────────────────────────────────────────');
  console.log('  🔑 All passwords: Test@1234');
  console.log('───────────────────────────────────────────────');
  console.log('  📌 Login as admin in Postman:');
  console.log('  POST http://localhost:3000/api/auth/login');
  console.log('  { "email": "admin@medibook.com", "password": "Test@1234" }');
  console.log('───────────────────────────────────────────────');
  console.log('  📌 Then test these endpoints with the JWT token:');
  console.log('  GET /api/admin/dashboard');
  console.log('  GET /api/admin/dashboard/reviews-stats');
  console.log('  GET /api/admin/dashboard/appointments-analytics');
  console.log('  GET /api/admin/dashboard/top-doctors');
  console.log('═══════════════════════════════════════════════\n');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
