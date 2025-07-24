import { PrismaClient } from '@prisma/client'

const doctors = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    qualifications: ['MBBS', 'MD', 'FACC'],
    departments: ['Cardiology']
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    qualifications: ['MBBS', 'MS', 'FRCS'],
    departments: ['Neurosurgery', 'Surgery']
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    qualifications: ['MBBS', 'MD', 'FASCO'],
    departments: ['Oncology', 'Medical Oncology']
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    qualifications: ['MBBS', 'MS', 'FAAOS'],
    departments: ['Orthopedics']
  },
  {
    firstName: 'Lisa',
    lastName: 'Wang',
    qualifications: ['MBBS', 'MD', 'FAAP'],
    departments: ['Pediatrics', 'Pediatric Cardiology']
  },
  {
    firstName: 'Robert',
    lastName: 'Williams',
    qualifications: ['MBBS', 'MD', 'FAAD'],
    departments: ['Dermatology']
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    qualifications: ['MBBS', 'MD', 'FACG'],
    departments: ['Gastroenterology']
  },
  {
    firstName: 'James',
    lastName: 'Miller',
    qualifications: ['MBBS', 'MD', 'FCCP'],
    departments: ['Pulmonology', 'Critical Care Medicine']
  },
  {
    firstName: 'Jennifer',
    lastName: 'Davis',
    qualifications: ['MBBS', 'MD', 'FACE'],
    departments: ['Endocrinology']
  },
  {
    firstName: 'Christopher',
    lastName: 'Brown',
    qualifications: ['MBBS', 'MD', 'FASN'],
    departments: ['Nephrology']
  },
  {
    firstName: 'Amanda',
    lastName: 'Wilson',
    qualifications: ['MBBS', 'MD', 'ACR'],
    departments: ['Rheumatology']
  },
  {
    firstName: 'Daniel',
    lastName: 'Moore',
    qualifications: ['MBBS', 'MD', 'FACP'],
    departments: ['Hematology', 'Hematology-Oncology']
  },
  {
    firstName: 'Jessica',
    lastName: 'Taylor',
    qualifications: ['MBBS', 'MD', 'FIDSA'],
    departments: ['Infectious Diseases']
  },
  {
    firstName: 'Matthew',
    lastName: 'Anderson',
    qualifications: ['MBBS', 'MD', 'APA'],
    departments: ['Psychiatry']
  },
  {
    firstName: 'Ashley',
    lastName: 'Thomas',
    qualifications: ['MBBS', 'MD', 'FACEP'],
    departments: ['Emergency Medicine']
  },
  {
    firstName: 'Kevin',
    lastName: 'Jackson',
    qualifications: ['MBBS', 'MD', 'ASA'],
    departments: ['Anesthesiology']
  },
  {
    firstName: 'Nicole',
    lastName: 'White',
    qualifications: ['MBBS', 'MD', 'ABR'],
    departments: ['Radiology', 'Diagnostic Radiology']
  },
  {
    firstName: 'Ryan',
    lastName: 'Harris',
    qualifications: ['MBBS', 'MD', 'CAP'],
    departments: ['Pathology']
  },
  {
    firstName: 'Michelle',
    lastName: 'Martin',
    qualifications: ['MBBS', 'MS', 'ACS'],
    departments: ['Surgery', 'Plastic Surgery']
  },
  {
    firstName: 'Andrew',
    lastName: 'Thompson',
    qualifications: ['MBBS', 'MS', 'FACS'],
    departments: ['Vascular Surgery', 'Surgery']
  },
  {
    firstName: 'Stephanie',
    lastName: 'Garcia',
    qualifications: ['MBBS', 'MD', 'AUA'],
    departments: ['Urology']
  },
  {
    firstName: 'Jonathan',
    lastName: 'Rodriguez',
    qualifications: ['MBBS', 'MD', 'ACOG'],
    departments: ['Gynecology', 'Obstetrics']
  },
  {
    firstName: 'Rachel',
    lastName: 'Lewis',
    qualifications: ['MBBS', 'MD', 'AAO'],
    departments: ['Ophthalmology']
  },
  {
    firstName: 'Brandon',
    lastName: 'Lee',
    qualifications: ['MBBS', 'MS', 'AAO-HNS'],
    departments: ['ENT']
  },
  {
    firstName: 'Samantha',
    lastName: 'Walker',
    qualifications: ['BDS', 'MDS', 'OMFS'],
    departments: ['Dentistry', 'Oral Surgery']
  },
  {
    firstName: 'Timothy',
    lastName: 'Hall',
    qualifications: ['MBBS', 'MD', 'AGS'],
    departments: ['Geriatrics']
  },
  {
    firstName: 'Melissa',
    lastName: 'Allen',
    qualifications: ['MBBS', 'MD', 'ACSM'],
    departments: ['Sports Medicine']
  },
  {
    firstName: 'Joshua',
    lastName: 'Young',
    qualifications: ['MBBS', 'MD', 'AAPMR'],
    departments: ['Rehabilitation Medicine']
  },
  {
    firstName: 'Lauren',
    lastName: 'Hernandez',
    qualifications: ['MBBS', 'MD', 'AAPM'],
    departments: ['Pain Management']
  },
  {
    firstName: 'Justin',
    lastName: 'King',
    qualifications: ['MBBS', 'MD', 'AAHPM'],
    departments: ['Palliative Care']
  },
  {
    firstName: 'Megan',
    lastName: 'Wright',
    qualifications: ['MBBS', 'MD', 'AASM'],
    departments: ['Sleep Medicine']
  },
  {
    firstName: 'Benjamin',
    lastName: 'Lopez',
    qualifications: ['MBBS', 'MD', 'AAAAI'],
    departments: ['Allergy and Immunology']
  },
  {
    firstName: 'Kimberly',
    lastName: 'Hill',
    qualifications: ['MBBS', 'MD', 'ACMG'],
    departments: ['Clinical Genetics', 'Medical Genetics']
  },
  {
    firstName: 'Jacob',
    lastName: 'Scott',
    qualifications: ['MBBS', 'MD', 'SNMMI'],
    departments: ['Nuclear Medicine']
  },
  {
    firstName: 'Hannah',
    lastName: 'Green',
    qualifications: ['MBBS', 'MD', 'ASTRO'],
    departments: ['Radiation Oncology']
  },
  {
    firstName: 'Nathan',
    lastName: 'Adams',
    qualifications: ['MBBS', 'MS', 'SSO'],
    departments: ['Surgical Oncology', 'Surgery']
  },
  {
    firstName: 'Brittany',
    lastName: 'Baker',
    qualifications: ['MBBS', 'MD', 'FAAP'],
    departments: ['Pediatric Oncology', 'Pediatrics']
  },
  {
    firstName: 'Tyler',
    lastName: 'Gonzalez',
    qualifications: ['MBBS', 'MD', 'SIR'],
    departments: ['Interventional Radiology', 'Radiology']
  },
  {
    firstName: 'Kayla',
    lastName: 'Nelson',
    qualifications: ['MBBS', 'MD', 'ARRS'],
    departments: ['Neuroradiology', 'Radiology']
  },
  {
    firstName: 'Zachary',
    lastName: 'Carter',
    qualifications: ['MBBS', 'MD', 'SCAI'],
    departments: ['Interventional Cardiology', 'Cardiology']
  },
  {
    firstName: 'Alexis',
    lastName: 'Mitchell',
    qualifications: ['MBBS', 'MD', 'HRS'],
    departments: ['Electrophysiology', 'Cardiology']
  },
  {
    firstName: 'Cameron',
    lastName: 'Perez',
    qualifications: ['MBBS', 'MS', 'APSA'],
    departments: ['Pediatric Surgery', 'Pediatrics']
  },
  {
    firstName: 'Taylor',
    lastName: 'Roberts',
    qualifications: ['MBBS', 'MS', 'AANS'],
    departments: ['Pediatric Neurosurgery', 'Neurosurgery']
  },
  {
    firstName: 'Jordan',
    lastName: 'Turner',
    qualifications: ['MBBS', 'MS', 'POSNA'],
    departments: ['Pediatric Orthopedics', 'Orthopedics']
  },
  {
    firstName: 'Morgan',
    lastName: 'Phillips',
    qualifications: ['MBBS', 'MS', 'SPU'],
    departments: ['Pediatric Urology', 'Urology']
  },
  {
    firstName: 'Connor',
    lastName: 'Campbell',
    qualifications: ['MBBS', 'MD', 'SMFM'],
    departments: ['Maternal-Fetal Medicine', 'Obstetrics']
  },
  {
    firstName: 'Paige',
    lastName: 'Parker',
    qualifications: ['MBBS', 'MD', 'ASRM'],
    departments: ['Reproductive Endocrinology', 'Gynecology']
  },
  {
    firstName: 'Ethan',
    lastName: 'Evans',
    qualifications: ['MBBS', 'MD', 'SGO'],
    departments: ['Gynecologic Oncology', 'Gynecology']
  },
  {
    firstName: 'Grace',
    lastName: 'Edwards',
    qualifications: ['MBBS', 'MD', 'AUGS'],
    departments: ['Urogynecology', 'Gynecology']
  },
  {
    firstName: 'Isaac',
    lastName: 'Collins',
    qualifications: ['MBBS', 'MD', 'AAP'],
    departments: ['Neonatology', 'Pediatrics']
  },
  {
    firstName: 'Chloe',
    lastName: 'Stewart',
    qualifications: ['MBBS', 'MD', 'SCCM'],
    departments: ['Pediatric Intensive Care', 'Pediatrics']
  }
]

async function seedDoctors(prisma: PrismaClient) {
  console.log('Start seeding doctors...')
  
  for (const doctorData of doctors) {
    // Create the doctor
    const doctor = await prisma.doctor.create({
      data: {
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        qualifications: doctorData.qualifications,
      },
    })

    // Create department mappings
    for (const departmentName of doctorData.departments) {
      const department = await prisma.department.findFirst({
        where: { name: departmentName }
      })

      if (department) {
        await prisma.doctorDepartment.create({
          data: {
            doctorId: doctor.id,
            departmentId: department.id,
          },
        })
      }
    }
  }
  
  console.log(`Seeded ${doctors.length} doctors with department mappings.`)
}

export default seedDoctors