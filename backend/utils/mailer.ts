import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendApplicationSubmittionEmail = async (email: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Application submitted'
    }
    const result = await transporter.sendMail(mailOptions);
}

export const sendWelcomeEmail = async (email: string, name: string, tempPassword: string) => {
    const mailOptions = {
        from: '"BGMI Partner Program" <noreply@yourdomain.com>',
        to: email,
        subject: `You're In. Welcome to the BGMI Campus MVP Program, ${name}!`,
        html: `
            <div style="background-color: #000000; color: #ffffff; padding: 20px; font-family: sans-serif; border: 1px solid #facc15; max-width: 600px; margin: 0 auto;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 25px; border-collapse: collapse;">
                    <tr>
                        <td align="left" valign="top" style="font-family: sans-serif; font-size: 20px; line-height: 1.3; font-weight: bold; color: #ffb60e; padding-right: 15px;">
                            BGMI Campus MVP Program
                        </td>
                    </tr>
                </table>
                <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
                    <strong>You're in,</strong>
                    Out of thousands of applications received from campuses across India, you've been selected to join a group of students who will represent BGMI as official Campus MVPs.
                </p>
                <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 25px 0;">
                    This isn't just another campus ambassador program—it's an opportunity to build your college gaming community, complete missions, earn rewards, and compete for national recognition alongside the country's top student creators and leaders.
                </p>
                <p style="font-family: sans-serif; font-size: 16px; line-height: 1.4; color: #ffffff; margin: 0 0 10px 0;">
                    <b>Your MVP Command Center</b>
                </p>
    
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111111; border-left: 4px solid #facc15; margin-bottom: 25px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 15px; font-family: sans-serif; font-size: 14px; line-height: 1.5; color: #ffffff;">
                            <p style="margin: 0 0 8px 0; word-break: break-all;">
                                <b>Dashboard: <a href="${process.env.STUDENT_DASHBOARD_LINK}" target="_blank" style="color: #ffb60e; text-decoration: underline;">MVP Dashboard</a></b>
                            </p>
                            <p style="margin: 0;">
                                <b>Temporary Access Key: <span style="color: #facc15;">${tempPassword}</span></b>
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
                    Use the temporary access key above to sign in to your MVP Dashboard. During your first login, you'll create a permanent password to secure your account.
                </p>
                <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
                    Every mission you complete will bring you closer to exclusive rewards, higher leaderboard rankings, and opportunities reserved for the top performing Campus MVPs.
                </p>
                <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 30px 0;">
                    Your Journey starts now.
                </p>

                <p style="font-family: sans-serif; font-size: 15px; line-height: 1.4; color: #ffffff; margin: 0;">
                    <b>Team BGMI Campus MVP</b>
                </p>
            </div>
        `
    }

    return transporter.sendMail(mailOptions);
}

export const sendRejectionEmail = async (email: string, name: string) => {
    const mailOptions = {
        from: '"BGMI Partner Program" <noreply@yourdomain.com>',
        to: email,
        subject: 'MISSION DEBRIEF: APPLICATION STATUS UPDATE',
        html: `
            <div style="background-color: #000; color: #fff; padding: 20px; font-family: sans-serif; border: 1px solid #4b5563;">
                <h1 style="color: #9ca3af;">STATUS: DEFERRED</h1>
                <p>Hello <b>${name}</b>,</p>
                <p>You did it!</p>
                <p>Thank you for your interest in the Ambassador Program. After a thorough review of your current profile, we have decided <b>not to proceed</b> with your application at this time.</p>
                
                <div style="background-color: #111; padding: 15px; border-left: 4px solid #4b5563; margin: 20px 0;">
                    <p style="margin: 0; color: #9ca3af;"><b>REASONING:</b> High volume of applicants / Strategic alignment.</p>
                </div>
                
                <p>While this mission is not a match, we encourage you to continue honing your skills. Your data will remain on file for future recruitment cycles.</p>
                
                <p>Stay sharp, Operative.</p>
                <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">This is an automated transmission. Do not attempt to reply.</p>
            </div>
        `
    }

    return transporter.sendMail(mailOptions);
}

export const sendReSubmissionRequestAcceptedEmail = async (email: string, name: string, taskTitle: string) => {
    const mailOptions = {
        from: '"BGMI Partner Program" <noreply@yourdomain.com',
        to: email,
        subject: 'Your Task Resubmission Request Has Been Approved',
        html: `
            <div style="background-color: #000000; color: #ffffff; padding: 20px; font-family: sans-serif; border: 1px solid #facc15; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 25px; border-collapse: collapse;">
        <tr>
            <td align="left" valign="top" style="font-family: sans-serif; font-size: 20px; line-height: 1.3; font-weight: bold; color: #ffb60e; padding-right: 15px;">
                BGMI Campus MVP Program
            </td>
        </tr>
    </table>

    <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
        <strong>Hello ${name.split(" ")[0]},</strong>
    </p>

    <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
        Your request to resubmit your task has been <strong>approved</strong>.
    </p>

    <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
        You can now log in to the <strong>BGMI Campus MVP Ambassador Dashboard</strong> and submit the updated version of your task.
    </p>

    <p style="font-family: sans-serif; font-size: 16px; line-height: 1.4; color: #ffffff; margin: 0 0 10px 0;">
        <b>Task Details:</b>
    </p>

    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111111; border-left: 4px solid #facc15; margin-bottom: 25px; border-collapse: collapse;">
        <tr>
            <td style="padding: 15px; font-family: sans-serif; font-size: 14px; line-height: 1.7; color: #ffffff;">
                • <strong>Task:</strong> ${taskTitle}<br>
                • <strong>Status:</strong> Resubmission Approved<br>
                • <strong>Resubmission Deadline:</strong> 30th August 2026, 11:59 PM (IST)
            </td>
        </tr>
    </table>

    <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 15px 0;">
        Please ensure that your updated submission is completed <strong>on or before the deadline</strong>. Submissions received after the deadline will not be considered.
    </p>

    <p style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #ffffff; margin: 0 0 25px 0;">
        If you have any questions or need any assistance, feel free to reach out to your assigned POC.
    </p>

    <p style="font-family: sans-serif; font-size: 15px; line-height: 1.4; color: #ffffff; margin: 0;">
        Best Regards,<br>
        <b>Team BGMI Campus MVP Program</b>
    </p>
</div>
        `
    }

    return transporter.sendMail(mailOptions);
}

export const sendReSubmissionRequestRejectionMail = async (email: string, name: string) => {
    const mailOptions = {
        from: '"BGMI Partner Program" <noreply@yourdomain.com',
        to: email,
        subject: 'RE-SUBMISSION REQUEST REJECTED',
        html: `
            <div></div>
        `
    }

    return transporter.sendMail(mailOptions);
}