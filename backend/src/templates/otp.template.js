const otpTemplate = ({ name, otp }) => {
  return `
    <h3>Hello ${name},</h3>
    <p>Your OTP is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
  `;
};

export default otpTemplate;
