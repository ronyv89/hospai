import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateUsername(firstName: string, lastName: string): string {
  // Clean and format the names - remove spaces, convert to lowercase
  const cleanFirstName = firstName.replace(/\s+/g, "").toLowerCase();
  const cleanLastName = lastName.replace(/\s+/g, "").toLowerCase();

  // Create base username: dr + firstname + lastname
  return `dr${cleanFirstName}${cleanLastName}`;
}

async function seedDoctorUsernames() {
  try {
    console.log("🌱 Starting doctor username seeding...");

    // Get all doctors without usernames
    const doctors = await prisma.doctor.findMany({
      where: {
        username: null,
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }, { id: "asc" }],
    });

    console.log(`Found ${doctors.length} doctors without usernames`);

    if (doctors.length === 0) {
      console.log("✅ No doctors need usernames. Seeding complete!");
      return;
    }

    // Track used usernames to handle duplicates
    const usedUsernames = new Set<string>();

    // Get existing usernames from database
    const existingDoctors = await prisma.doctor.findMany({
      where: {
        username: {
          not: null,
        },
      },
      select: {
        username: true,
      },
    });

    // Add existing usernames to the set
    existingDoctors.forEach((doctor) => {
      if (doctor.username) {
        usedUsernames.add(doctor.username);
      }
    });

    const updates: Array<{ id: number; username: string }> = [];

    // Generate unique usernames for each doctor
    for (const doctor of doctors) {
      const baseUsername = generateUsername(doctor.firstName, doctor.lastName);
      let finalUsername = baseUsername;
      let counter = 1;

      // Handle duplicates by appending numbers
      while (usedUsernames.has(finalUsername)) {
        counter++;
        finalUsername = `${baseUsername}${counter}`;
      }

      usedUsernames.add(finalUsername);
      updates.push({
        id: doctor.id,
        username: finalUsername,
      });

      console.log(
        `Dr ${doctor.firstName} ${doctor.lastName} -> ${finalUsername}`
      );
    }

    // Update doctors with their new usernames
    for (const update of updates) {
      await prisma.doctor.update({
        where: { id: update.id },
        data: { username: update.username },
      });
    }

    console.log(
      `✅ Successfully updated ${updates.length} doctors with usernames`
    );

    // Verify the updates
    const updatedCount = await prisma.doctor.count({
      where: {
        username: {
          not: null,
        },
      },
    });

    console.log(`📊 Total doctors with usernames: ${updatedCount}`);
  } catch (error) {
    console.error("❌ Error seeding doctor usernames:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedDoctorUsernames()
    .then(() => {
      console.log("🎉 Username seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Username seeding failed:", error);
      process.exit(1);
    });
}

export { seedDoctorUsernames };
