import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { IoMailOpenOutline } from "react-icons/io5";
import axios from "axios";
import constantApi from "../constantApi";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  // const navigation = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  const [company, setCompany] = useState(null); // Store API response
  // const [loading, setLoading] = useState(false);

  const navigation = useNavigate();

  // Fetch company details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setPageLoading(true);

        const response = await axios.post(
          `${constantApi.baseUrl}/company/details`,
          { id: "20" }
        );

        if (response.data?.status) {
          setCompany(response.data.data);
          // console.log("ggg", response.data)

        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCompany();
  }, []);


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_yj6o0f1",
        "template_xzlw3wb",
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          subject: formData.subject,
          message: formData.message,
        },
        {
          publicKey: "QK37d7TWxJs7X3J5x",
        }
      )
      .then(() => {
        Swal.fire({
          title: "Thank you!",
          text: "Your form has been submitted!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigation("/");
        });

        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.error("EmailJS Error:", error);
      });
  };
  const dialNumber = (num) => {
    if (!num) return;
    const clean = num.toString().replace(/\D/g, ""); // remove spaces & symbols
    window.location.href = `tel:${clean}`;
  };
  const getPrimaryPhone = () => {
    if (!company?.company_address?.length) return null;

    const addr = company.company_address[0];

    return (
      addr.contact_no ||
      addr.other_number_2 ||
      addr.other_number_3 ||
      addr.landline_no ||
      addr.toll_free_number ||
      null
    );
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex gap-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 ">
      <div className="w-full bg-[#081E5B] h-[140px] mb-3">
        <div className=" max-w-4xl mx-auto h-full flex justify-between items-center px-4">
          <div>
            <h1 className="text-2xl text-white">Call To Action</h1>
          </div>
          <div className="hover:bg-[#50D8AF]">
            <button
              onClick={() => {
                const phone = getPrimaryPhone();
                if (phone) dialNumber(phone);
                else alert("Phone number not available");
              }}
              className="text-white border px-5 py-2 font-medium"
            >
              Call To Action
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 my-6">
        <div className="flex flex-col md:flex-row gap-20 text-center mx-auto leading-loose justify-between">

          {/* CARD 1 */}
          <div className="flex-1 flex flex-col items-center text-center space-y-2 md:border-r md:border-gray-300 px-6">
            <span className="text-3xl text-blue-600 block">
              <IoLocationOutline />
            </span>
            <h2 className=" font-semibold text-2xl text-gray-500">ADDRESS</h2>
            {company?.company_address?.length > 0 ? (
              company.company_address.map((addr) => (
                <p key={addr.id} className="text-sm">
                  {addr.address_name}, {addr.address}, {addr.postal_code}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No address available</p>
            )}
          </div>

          {/* CARD 2 */}
          <div className="flex-1 flex flex-col items-center space-y-2 md:border-r md:border-gray-300 px-6">
            <span className="text-3xl text-blue-600">
              <FiPhone />
            </span>
            <h2 className=" font-semibold text-2xl text-gray-500">PHONE</h2>
            {company?.company_address?.length > 0 ? (
              company.company_address.map((addr) => (
                <div > <p key={addr.id} className="text-sm">
                  {addr.contact_no && addr.contact_no !== 0 ? `(+91) ${addr.contact_no}` : null}
                  {addr.landline_no ? <><br />{addr.landline_no}</> : null}
                  {addr.toll_free_number ? <><br />{addr.toll_free_number}</> : null}
                  {!addr.contact_no && !addr.landline_no && !addr.toll_free_number ? "" : null}
                </p>
                  <p key={addr.id} className="text-sm">
                    {addr.other_number_2 && addr.other_number_2 !== 0 ? `(+91) ${addr.other_number_2}` : null}
                    {addr.landline_no ? <><br />{addr.landline_no}</> : null}
                    {addr.toll_free_number ? <><br />{addr.toll_free_number}</> : null}
                    {!addr.other_number_2 && !addr.landline_no && !addr.toll_free_number ? "" : null}
                  </p>
                  <p key={addr.id} className="text-sm">
                    {addr.other_number_3 && addr.other_number_3 !== 0 ? `(+91) ${addr.other_number_3}` : null}
                    {addr.landline_no ? <><br />{addr.landline_no}</> : null}
                    {addr.toll_free_number ? <><br />{addr.toll_free_number}</> : null}
                    {!addr.other_number_3 && !addr.landline_no && !addr.toll_free_number ? "" : null}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No phone available</p>
            )}

          </div>

          {/* CARD 3 */}
          <div className="flex-1 flex flex-col items-center space-y-2 ">
            <span className="text-3xl text-blue-600">
              <IoMailOpenOutline />
            </span>
            <h2 className="font-semibold text-2xl text-gray-500">EMAIL</h2>
            {company?.company_address?.length > 0 ? (
              company.company_address.map((addr) => (
                <div>
                  <p key={addr.id} className="text-sm">
                    {addr.email ? addr.email : ""}
                  </p>
                  <p key={addr.id} className="text-sm">
                    {addr.other_email_2 ? addr.other_email_2 : ""}
                  </p>
                  <p key={addr.id} className="text-sm">
                    {addr.other_email_3 ? addr.other_email_3 : ""}
                  </p>
                </div>

              ))
            ) : (
              <p className="text-sm text-gray-400">No email available</p>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 my-6">
        {/* <div className="flex  flex-col md:flex-row gap-20 text-center mx-auto leading-loose justify-between">

          <div className="flex flex-1 flex-col items-center space-y-2 md:border-r md:border-gray-300 px-6">
            <span className="text-3xl text-blue-600 block">
              <IoLocationOutline />
            </span>
            <h2 className=" font-semibold text-2xl text-gray-500">ADDRESS</h2>
            <p className="text-sm ">
              Dubai, UAE
            </p>
          </div>

          <div className="flex flex-1 flex-col items-center space-y-2 md:border-r md:border-gray-300 px-6">
            <span className="text-3xl text-blue-600 block">
              <FiPhone />
            </span>
            <h2 className=" font-semibold text-2xl text-gray-500">PHONE</h2>
            <p className="text-sm ">
              (+91) 9899-166988
            </p>
          </div>

          <div className="flex flex-1 flex-col items-center space-y-2 ">
            <span className="text-3xl text-blue-600 block">
              <IoMailOpenOutline />
            </span>
            <h2 className="font-semibold text-2xl text-gray-500">EMAIL</h2>
            <p className="text-sm ">
              info@sunnatibrahim.com
            </p>
          </div>

        </div> */}
      </div>
      {/* Google Map Section */}

      <div className="w-[90%] max-w-7xl mx-auto h-[50vh] rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d56065.87822241938!2d77.21281342167966!3d28.5662375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x390ce38a2385d5fb%3A0x548c4ce65e6d3b24!2sMAKTABA%20SHAH%20WALIULLAH%2C%2025%20B%201%2C%20Rehman%20Complex%2C%20Jamia%20Nagar%20Block%20B%2C%20Joga%20Bai%2C%20Okhla%2C%20Batla%20House%2C%20Okhla%2C%20New%20Delhi%2C%20Delhi%20110025!3m2!1d28.5662375!2d77.2849112!5e0!3m2!1sen!2sin!4v1765952743595!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0"
        ></iframe>
      </div>
      {/* Contact Form Section */}
      <div className="max-w-4xl mx-auto mt-3 mb-10 p-4 md:p-10  bg-white border border-red-300 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h2>

        <form onSubmit={sendEmail} className="space-y-6">

          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full p-3 mt-1 rounded-lg border border-gray-300 
                   focus:ring-2 focus:ring-red-500 outline-none text-xs
"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full p-3 mt-1 rounded-lg border border-gray-300 
                   focus:ring-2 focus:ring-red-500 outline-none text-xs
"
              />
            </div>
          </div>

          {/* Mobile + Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block">
                Mobile
              </label>
              <input
                type="number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
                className="w-full p-3 mt-1 rounded-lg border border-gray-300 
                   focus:ring-2 focus:ring-red-500 outline-none text-xs
"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Message subject"
                required
                className="w-full p-3 mt-1 rounded-lg border border-gray-300 
                   focus:ring-2 focus:ring-red-500 outline-none text-xs
"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-700 block">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Write your message here..."
              required
              className="w-full p-3 mt-1 rounded-lg border border-gray-300 
                 focus:ring-2 focus:ring-red-500 outline-none text-xs
"
            />
          </div>

          {/* Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 
                 transition-all text-white font-semibold rounded-lg"
            >
              {loading ? "Submitting..." : "Send Message"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );

};

export default ContactUs;
