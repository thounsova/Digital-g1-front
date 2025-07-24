// "use client";

// import React from "react";
// import CorporateCardForm from "@/app/auth/Form-create/CorporateCardForm";
// import { authRequest } from "@/lib/api/auth-api";
// import { IUser } from "@/app/types/user-typ";
// import { CardItem } from "@/app/types/card-type";

// // Mock card
// const mockCard: CardItem = {
//   id: "card456",
//   job: "Software Engineer",
//   company: "CodeFlow Inc.",
//   phone: "086280018",
//   web_site: "https://johnsportfolio.com",
//   address: "Phnom Penh, Cambodia",
//   bio: "I’m a full-stack engineer who loves building sleek UIs.",
// };

// // Mock user (valid with all required fields)
// const mockUser: IUser = {
//   message: "User fetched successfully",
//   data: {
//     id: "user123",
//     full_name: "John Doe",
//     user_name: "johndoe",
//     email: "john@example.com",
//     password: "", // Not used in frontend, but required by type
//     avatar: "https://i.pravatar.cc/150?img=12",
//     is_deleted: false,
//     is_active: true,
//     roles: ["user"],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     idCard: [mockCard],
//   },
// };

// const CardFormPage = () => {
//   const { CREATE_CARD } = authRequest();

//   const handleSubmit = async (data: any) => {
//     try {
//       const response = await CREATE_CARD(data);
//       console.log("Card created successfully:", response.data);
//       alert("Card created!");
//     } catch (error) {
//       console.error("Error creating card:", error);
//       alert("Something went wrong.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <CorporateCardForm me={mockUser} card={mockCard} idx={0} onSubmit={handleSubmit} />
//     </div>
//   );
// };

// export default CardFormPage;
