import { PrismaClient } from '@prisma/client'

const hospitals = [
  {
    name: 'City General Hospital',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(212) 555-0100',
    email: 'info@citygeneralhospital.com',
    website: 'https://www.citygeneralhospital.com',
    type: 'major_teaching', // Large academic medical center
    departments: [
      // Core departments
      'Emergency Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics', 
      'Pediatrics', 'Radiology', 'Anesthesiology', 'Pathology', 'Oncology',
      // Specialized departments
      'Neurosurgery', 'Cardiac Surgery', 'Plastic Surgery', 'Vascular Surgery',
      'Urology', 'Gynecology', 'Obstetrics', 'Ophthalmology', 'ENT', 'Dermatology',
      'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Nephrology', 'Rheumatology',
      'Hematology', 'Infectious Diseases', 'Psychiatry', 'Critical Care Medicine',
      // Advanced specialties
      'Interventional Cardiology', 'Electrophysiology', 'Interventional Radiology',
      'Radiation Oncology', 'Medical Oncology', 'Surgical Oncology', 'Neonatology',
      'Pediatric Surgery', 'Maternal-Fetal Medicine', 'Pain Management'
    ]
  },
  {
    name: 'Metro Medical Center',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    phone: '(323) 555-0200',
    email: 'contact@metromedical.com',
    website: 'https://www.metromedical.com',
    type: 'community_hospital', // Mid-size community hospital
    departments: [
      // Core departments
      'Emergency Medicine', 'Surgery', 'Cardiology', 'Orthopedics', 
      'Pediatrics', 'Radiology', 'Anesthesiology', 'Pathology',
      // Common specialties
      'Urology', 'Gynecology', 'Obstetrics', 'Gastroenterology', 'Pulmonology',
      'Endocrinology', 'Dermatology', 'Ophthalmology', 'ENT', 'Psychiatry',
      'Physical Therapy', 'Rehabilitation Medicine'
    ]
  },
  {
    name: 'University Hospital',
    address: '789 University Drive',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phone: '(312) 555-0300',
    email: 'info@universityhospital.edu',
    website: 'https://www.universityhospital.edu',
    type: 'academic_medical_center', // Research and teaching hospital
    departments: [
      // Core departments
      'Emergency Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics', 
      'Pediatrics', 'Radiology', 'Anesthesiology', 'Pathology', 'Oncology',
      // Medical specialties
      'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Nephrology', 'Rheumatology',
      'Hematology', 'Infectious Diseases', 'Psychiatry', 'Dermatology',
      // Surgical specialties
      'Neurosurgery', 'Plastic Surgery', 'Vascular Surgery', 'Urology', 
      'Gynecology', 'Obstetrics', 'Ophthalmology', 'ENT',
      // Advanced care
      'Critical Care Medicine', 'Interventional Cardiology', 'Medical Oncology',
      'Radiation Oncology', 'Neonatology', 'Clinical Research', 'Medical Education'
    ]
  },
  {
    name: 'Regional Medical Center',
    address: '321 Health Plaza',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    phone: '(713) 555-0400',
    email: 'contact@regionalmedical.com',
    website: 'https://www.regionalmedical.com',
    type: 'regional_hospital', // Large regional hospital
    departments: [
      // Core departments
      'Emergency Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics', 
      'Pediatrics', 'Radiology', 'Anesthesiology', 'Pathology', 'Oncology',
      // Regional specialties
      'Trauma Surgery', 'Neurosurgery', 'Cardiac Surgery', 'Vascular Surgery',
      'Urology', 'Gynecology', 'Obstetrics', 'Gastroenterology', 'Pulmonology',
      'Endocrinology', 'Nephrology', 'Critical Care Medicine', 'Pain Management',
      'Rehabilitation Medicine', 'Sleep Medicine'
    ]
  },
  {
    name: 'St. Mary\'s Hospital',
    address: '654 Mercy Lane',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    phone: '(617) 555-0500',
    email: 'info@stmaryshospital.org',
    website: 'https://www.stmaryshospital.org',
    type: 'specialty_hospital', // Focused on specific areas
    departments: [
      // Core departments
      'Emergency Medicine', 'Surgery', 'Cardiology', 'Radiology', 'Anesthesiology', 'Pathology',
      // Specialty focus areas
      'Cardiac Surgery', 'Interventional Cardiology', 'Electrophysiology',
      'Vascular Surgery', 'Critical Care Medicine', 'Pain Management',
      'Rehabilitation Medicine', 'Physical Therapy'
    ]
  }
]

async function seedHospitals(prisma: PrismaClient) {
  console.log('Start seeding hospitals...')
  
  // Get all departments and doctors
  const allDepartments = await prisma.department.findMany()
  const allDoctors = await prisma.doctor.findMany({
    include: {
      doctorDepartments: {
        include: {
          department: true
        }
      }
    }
  })

  for (const hospitalData of hospitals) {
    // Create hospital
    const hospital = await prisma.hospital.create({
      data: {
        name: hospitalData.name,
        address: hospitalData.address,
        city: hospitalData.city,
        state: hospitalData.state,
        zipCode: hospitalData.zipCode,
        phone: hospitalData.phone,
        email: hospitalData.email,
        website: hospitalData.website,
      },
    })

    console.log(`Created hospital: ${hospital.name} (${hospitalData.type})`)

    // Only add the specified departments for this hospital
    for (const departmentName of hospitalData.departments) {
      const department = allDepartments.find(d => d.name === departmentName)
      
      if (!department) {
        console.log(`  Warning: Department '${departmentName}' not found`)
        continue
      }

      const hospitalDepartment = await prisma.hospitalDepartment.create({
        data: {
          hospitalId: hospital.id,
          departmentId: department.id,
        },
      })

      // Find doctors who work in this department
      const departmentDoctors = allDoctors.filter(doctor => 
        doctor.doctorDepartments.some(dd => dd.departmentId === department.id)
      )

      // Assign 1-2 doctors to this department in this hospital
      const doctorsToAssign = departmentDoctors
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, Math.min(2, departmentDoctors.length)) // Take up to 2

      for (const doctor of doctorsToAssign) {
        await prisma.hospitalDepartmentDoctor.create({
          data: {
            hospitalDepartmentId: hospitalDepartment.id,
            doctorId: doctor.id,
          },
        })
      }

      console.log(`  Added ${doctorsToAssign.length} doctors to ${department.name}`)
    }
    
    console.log(`  Total departments: ${hospitalData.departments.length}`)
  }
  
  console.log(`Seeded ${hospitals.length} hospitals with realistic department distributions.`)
}

export default seedHospitals