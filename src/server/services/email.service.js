const transporter = require('../config/email.config');

const sendRegistrationConfirmation = async (event, userId) => {
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', userId)
    .single();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: `Registration Confirmation - ${event.event_name}`,
    html: `
      <h1>Registration Confirmation</h1>
      <p>Dear ${user.name},</p>
      <p>Your registration for ${event.event_name} has been received.</p>
      <p>Event Details:</p>
      <ul>
        <li>Event: ${event.event_name}</li>
        <li>Date: ${new Date(event.registration_deadline).toLocaleDateString()}</li>
        <li>Venue: ${event.venue}</li>
      </ul>
      <p>Thank you for registering!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRegistrationConfirmation
};