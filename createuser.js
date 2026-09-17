require("dotenv").config();
const prisma = require("./services/prismaClient");

async function run() {
    const user = await prisma.user.create({
        data: {
            name: "Test User",
            email: "test@example.com",
        },
    });
    console.log("Created user:", user);
}

run();