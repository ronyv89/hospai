import { PrismaClient } from '@prisma/client'
import seedDoctors from './doctors-seed'
import seedHospitals from './hospitals-seed'

const prisma = new PrismaClient()

const departments = [
  { name: 'Cardiology', description: 'Heart and cardiovascular system disorders' },
  { name: 'Neurology', description: 'Brain and nervous system disorders' },
  { name: 'Oncology', description: 'Cancer diagnosis and treatment' },
  { name: 'Orthopedics', description: 'Bone, joint, and muscle disorders' },
  { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
  { name: 'Dermatology', description: 'Skin, hair, and nail disorders' },
  { name: 'Gastroenterology', description: 'Digestive system disorders' },
  { name: 'Pulmonology', description: 'Lung and respiratory system disorders' },
  { name: 'Endocrinology', description: 'Hormone and metabolic disorders' },
  { name: 'Nephrology', description: 'Kidney and urinary system disorders' },
  { name: 'Rheumatology', description: 'Autoimmune and inflammatory disorders' },
  { name: 'Hematology', description: 'Blood and blood-forming organs disorders' },
  { name: 'Infectious Diseases', description: 'Bacterial, viral, and parasitic infections' },
  { name: 'Psychiatry', description: 'Mental health and behavioral disorders' },
  { name: 'Emergency Medicine', description: 'Acute and urgent medical care' },
  { name: 'Anesthesiology', description: 'Pain management and surgical anesthesia' },
  { name: 'Radiology', description: 'Medical imaging and diagnostic procedures' },
  { name: 'Pathology', description: 'Disease diagnosis through laboratory testing' },
  { name: 'Surgery', description: 'General surgical procedures' },
  { name: 'Plastic Surgery', description: 'Reconstructive and cosmetic surgery' },
  { name: 'Neurosurgery', description: 'Brain and nervous system surgery' },
  { name: 'Cardiac Surgery', description: 'Heart and cardiovascular surgery' },
  { name: 'Thoracic Surgery', description: 'Chest and lung surgery' },
  { name: 'Vascular Surgery', description: 'Blood vessel surgery' },
  { name: 'Urology', description: 'Urinary system and male reproductive disorders' },
  { name: 'Gynecology', description: 'Female reproductive system disorders' },
  { name: 'Obstetrics', description: 'Pregnancy, childbirth, and postpartum care' },
  { name: 'Ophthalmology', description: 'Eye and vision disorders' },
  { name: 'ENT', description: 'Ear, nose, and throat disorders' },
  { name: 'Dentistry', description: 'Oral and dental health' },
  { name: 'Oral Surgery', description: 'Surgical procedures of the mouth and jaw' },
  { name: 'Orthodontics', description: 'Teeth alignment and bite correction' },
  { name: 'Periodontics', description: 'Gum and supporting structures of teeth' },
  { name: 'Endodontics', description: 'Root canal and tooth pulp treatment' },
  { name: 'Prosthodontics', description: 'Tooth replacement and restoration' },
  { name: 'Pediatric Dentistry', description: 'Dental care for children' },
  { name: 'Geriatrics', description: 'Medical care for elderly patients' },
  { name: 'Sports Medicine', description: 'Athletic injuries and performance' },
  { name: 'Rehabilitation Medicine', description: 'Physical therapy and recovery' },
  { name: 'Pain Management', description: 'Chronic pain treatment and management' },
  { name: 'Palliative Care', description: 'Comfort care for serious illnesses' },
  { name: 'Critical Care Medicine', description: 'Intensive care and life support' },
  { name: 'Sleep Medicine', description: 'Sleep disorders diagnosis and treatment' },
  { name: 'Allergy and Immunology', description: 'Allergic reactions and immune disorders' },
  { name: 'Clinical Genetics', description: 'Genetic disorders and counseling' },
  { name: 'Medical Genetics', description: 'Hereditary diseases and genetic testing' },
  { name: 'Nuclear Medicine', description: 'Radioactive substances for diagnosis and treatment' },
  { name: 'Radiation Oncology', description: 'Cancer treatment using radiation therapy' },
  { name: 'Medical Oncology', description: 'Cancer treatment using medications' },
  { name: 'Surgical Oncology', description: 'Cancer treatment through surgery' },
  { name: 'Pediatric Oncology', description: 'Cancer treatment in children' },
  { name: 'Hematology-Oncology', description: 'Blood cancers and disorders' },
  { name: 'Interventional Radiology', description: 'Minimally invasive image-guided procedures' },
  { name: 'Diagnostic Radiology', description: 'Medical imaging interpretation' },
  { name: 'Neuroradiology', description: 'Brain and nervous system imaging' },
  { name: 'Musculoskeletal Radiology', description: 'Bone and joint imaging' },
  { name: 'Chest Radiology', description: 'Lung and chest imaging' },
  { name: 'Abdominal Radiology', description: 'Abdominal organ imaging' },
  { name: 'Breast Imaging', description: 'Breast cancer screening and diagnosis' },
  { name: 'Pediatric Radiology', description: 'Medical imaging for children' },
  { name: 'Emergency Radiology', description: 'Urgent medical imaging' },
  { name: 'Interventional Cardiology', description: 'Heart procedures using catheters' },
  { name: 'Electrophysiology', description: 'Heart rhythm disorders' },
  { name: 'Pediatric Cardiology', description: 'Heart conditions in children' },
  { name: 'Cardiac Anesthesiology', description: 'Anesthesia for heart procedures' },
  { name: 'Pediatric Surgery', description: 'Surgical procedures for children' },
  { name: 'Pediatric Neurosurgery', description: 'Brain surgery for children' },
  { name: 'Pediatric Orthopedics', description: 'Bone and joint surgery for children' },
  { name: 'Pediatric Urology', description: 'Urinary system surgery for children' },
  { name: 'Maternal-Fetal Medicine', description: 'High-risk pregnancy care' },
  { name: 'Reproductive Endocrinology', description: 'Fertility and hormone disorders' },
  { name: 'Gynecologic Oncology', description: 'Cancer of female reproductive organs' },
  { name: 'Urogynecology', description: 'Pelvic floor disorders in women' },
  { name: 'Neonatology', description: 'Medical care for newborn infants' },
  { name: 'Pediatric Intensive Care', description: 'Critical care for children' },
  { name: 'Pediatric Emergency Medicine', description: 'Emergency care for children' },
  { name: 'Adolescent Medicine', description: 'Healthcare for teenagers' },
  { name: 'Developmental Pediatrics', description: 'Child development and behavioral issues' },
  { name: 'Pediatric Endocrinology', description: 'Hormone disorders in children' },
  { name: 'Pediatric Gastroenterology', description: 'Digestive disorders in children' },
  { name: 'Pediatric Pulmonology', description: 'Lung disorders in children' },
  { name: 'Pediatric Nephrology', description: 'Kidney disorders in children' },
  { name: 'Pediatric Rheumatology', description: 'Autoimmune disorders in children' },
  { name: 'Pediatric Hematology', description: 'Blood disorders in children' },
  { name: 'Pediatric Infectious Diseases', description: 'Infections in children' },
  { name: 'Child and Adolescent Psychiatry', description: 'Mental health care for young people' },
  { name: 'Forensic Psychiatry', description: 'Mental health in legal contexts' },
  { name: 'Addiction Medicine', description: 'Substance abuse treatment' },
  { name: 'Occupational Medicine', description: 'Work-related health issues' },
  { name: 'Preventive Medicine', description: 'Disease prevention and health promotion' },
  { name: 'Public Health', description: 'Community health and disease prevention' },
  { name: 'Epidemiology', description: 'Disease patterns and public health research' },
  { name: 'Biostatistics', description: 'Statistical analysis of medical data' },
  { name: 'Health Informatics', description: 'Medical information systems and technology' },
  { name: 'Telemedicine', description: 'Remote healthcare delivery' },
  { name: 'Clinical Research', description: 'Medical research and clinical trials' },
  { name: 'Biomedical Engineering', description: 'Medical device development and research' },
  { name: 'Medical Education', description: 'Training and education of healthcare professionals' },
  { name: 'Quality Improvement', description: 'Healthcare quality and safety initiatives' },
  { name: 'Patient Safety', description: 'Preventing medical errors and improving safety' },
  { name: 'Healthcare Administration', description: 'Hospital and healthcare system management' },
  { name: 'Medical Ethics', description: 'Ethical issues in healthcare' },
  { name: 'Chaplaincy', description: 'Spiritual care and support services' },
  { name: 'Social Work', description: 'Psychosocial support and resource coordination' },
  { name: 'Nutrition Services', description: 'Dietary counseling and therapeutic nutrition' },
  { name: 'Pharmacy', description: 'Medication management and pharmaceutical care' },
  { name: 'Physical Therapy', description: 'Movement and mobility rehabilitation' },
  { name: 'Occupational Therapy', description: 'Daily living skills rehabilitation' },
  { name: 'Speech Therapy', description: 'Communication and swallowing disorders treatment' },
  { name: 'Respiratory Therapy', description: 'Breathing and lung function support' }
]

async function main() {
  console.log('Start seeding...')
  
  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: {},
      create: {
        name: department.name,
        description: department.description,
      },
    })
  }
  
  console.log(`Seeded ${departments.length} departments.`)
  
  // Seed doctors after departments are created
  await seedDoctors(prisma)
  
  // Seed hospitals after doctors and departments are created
  await seedHospitals(prisma)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })