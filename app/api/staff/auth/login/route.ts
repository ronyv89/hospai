import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staffType, username, password } = body;

    if (!staffType || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Staff type, username and password are required' },
        { status: 400 }
      );
    }

    // Validate staff type
    if (staffType !== "doctor") {
      return NextResponse.json(
        { success: false, message: 'Invalid staff type' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual authentication logic
    // For now, we'll check against doctor usernames from the database
    // In a real implementation, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Use proper JWT tokens
    // 3. Implement proper session management
    // 4. Add rate limiting and other security measures

    // Mock authentication - accept any doctor username with password "password"
    // In production, this should be replaced with proper authentication
    if (staffType === "doctor" && password === "password" && username.startsWith("dr")) {
      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const payload = {
        username: username,
        staffType: staffType,
        role: 'doctor',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      };
      
      const token = jwt.sign(payload, jwtSecret);
      
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          username: username,
          staffType: staffType,
          role: 'doctor',
        }
      });
    }

    // Invalid credentials
    return NextResponse.json(
      { success: false, message: 'Invalid username or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Staff login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}