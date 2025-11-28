import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { verifyPassword } from '@/utils/verifyPassword';
import { generateToken, generateRefreshToken } from '@/utils/jwt';
import Client from '@/models/Client';
import User from '@/models/User';

// Helper function to authenticate user
async function authenticateUser(user, password) {
    console.log('🔐 Authenticating user:', user.username || user.email);

    if (user.status === 'banned') {
        console.log('🚫 User is banned');
        return NextResponse.json(
            {
                success: false,
                message: 'حساب کاربری شما مسدود شده است.',
            },
            { status: 403 }
        );
    }

    console.log('🔑 Verifying password...');
    const isValid = await verifyPassword(password, user.password);
    console.log('🔑 Password valid:', isValid);

    if (!isValid) {
        console.log('❌ Invalid password');
        return NextResponse.json(
            {
                success: false,
                message: 'نام کاربری یا رمز عبور صحیح نمی باشد.',
            },
            { status: 400 }
        );
    }

    console.log('✅ Password verified, generating tokens...');
    // Generate fresh tokens on login
    const token = generateToken('user', user._id.toString());
    const refreshToken = generateRefreshToken('user', user._id.toString());

    // Update tokens in database for reference (optional)
    user.token = token;
    user.refreshToken = refreshToken;
    await user.save();

    console.log('✅ Login successful for user:', user.username || user.email);

    return NextResponse.json({
        success: true,
        token,
        refreshToken,
    });
}


//CLIENT | USER LOGIN => "/api/auth/login"
export async function POST(req) {
    console.log('🔐 Login attempt started');

    try {
        await dbConnect();
        console.log('✅ Database connected');
    } catch (dbError) {
        console.error('❌ Database connection failed:', dbError.message);
        return NextResponse.json(
            { success: false, message: 'خطا در اتصال به پایگاه داده.' },
            { status: 500 }
        );
    }

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        console.log('📋 Login type:', type);

        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        console.log('👤 Login attempt for username:', username);
        console.log('🔑 Password provided:', password ? 'Yes' : 'No');

        if (type === 'user') {
            console.log('🔍 Searching for user with username:', username);
            const user = await User.findOne({ username });

            if (!user) {
                console.log('❌ User not found with username:', username);
                // Try searching by email as fallback
                console.log('🔍 Trying to find user by email:', username);
                const userByEmail = await User.findOne({ email: username });

                if (!userByEmail) {
                    console.log('❌ User not found by email either');
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'کاربر با این نام کاربری پیدا نشد.',
                        },
                        { status: 404 }
                    );
                }

                console.log('✅ User found by email:', userByEmail.email);
                // Use the user found by email
                return await authenticateUser(userByEmail, password);
            }

            console.log('✅ User found:', user.username, '| Email:', user.email, '| Status:', user.status);
            return await authenticateUser(user, password);
        } else if (type === 'client') {
            const client = await Client.findOne({ username });
            if (!client) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'متقاضی با این نام کاربری پیدا نشد.',
                    },
                    { status: 404 }
                );
            }

            if (client.status === 'banned') {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'حساب کاربری شما مسدود شده است.',
                    },
                    { status: 403 }
                );
            }

            const isValid = await verifyPassword(password, client.password);

            if (!isValid) {
                return NextResponse.json(
                    { success: false, message: 'رمز عبور اشتباه است.' },
                    { status: 400 }
                );
            }

            // Generate fresh tokens on login
            const token = generateToken('client', client._id.toString());
            const refreshToken = generateRefreshToken('client', client._id.toString());

            // Update tokens in database for reference (optional)
            client.token = token;
            client.refreshToken = refreshToken;
            await client.save();

            return NextResponse.json({
                success: true,
                token,
                refreshToken,
            });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
