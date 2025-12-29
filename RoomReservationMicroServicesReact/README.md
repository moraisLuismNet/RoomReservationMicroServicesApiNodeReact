# RoomReservationMicroServicesReact

A modern, responsive room reservation frontend built with React 19, TypeScript, and Tailwind CSS. This application serves as the client-side interface for the Room Reservation Microservices ecosystem, allowing users to browse rooms, manage reservations, and process payments securely.

## ✨ Features

- **🏨 Room Browsing**: Explore available rooms with high-quality images and detailed specifications.
- **📅 Interactive Booking**: Use an integrated calendar to select dates and check real-time availability.
- **🔐 Secure Payments**: Seamless integration with Stripe for safe and reliable transaction processing.
- **📱 Responsive Design**: Optimized for desktops, tablets, and mobile devices using Tailwind CSS.
- **🌐 User Dashboard**: Manage personal reservations, view booking history, and update profiles.
- **⚡ Performance First**: Built with Vite 6 for ultra-fast development and optimized production builds.
- **� Authentication**: Secure user login and registration with JWT handling.

## 🛠️ Technologies Used

- **Frontend**: React 19
- **Type Safety**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v7
- **Calendar**: FullCalendar 6
- **Payments**: Stripe React SDK
- **Date Handling**: date-fns
- **Build Tool**: Vite 6
- **Linting**: ESLint 9

## 📁 Project Structure

```text
src/
├── components/    # Reusable UI components (Modals, RoomCards, Navbar)
├── config/        # Environment and API configurations (FullCalendar config)
├── context/       # Auth and Theme context providers
├── core/          # Business logic and helper functions
├── models/        # TypeScript interfaces and DTOs
├── pages/         # Full page components (Home, Dashboard, Booking)
├── services/      # API communication layer (Stripe, Rooms, Reservations)
├── App.tsx        # Main application component & Routing
├── main.tsx       # Application entry point
├── index.css      # Core styles and Tailwind directives
└── vite-env.d.ts  # Vite client type definitions
```

| | | |
| :---: | :---: | :---: |
| <kbd><img src="img/01.png" width="60%" height="90%" alt="RoomReservationMicroServicesReact_01"></kbd> | <kbd><img src="img/02.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_02"></kbd> | <kbd><img src="img/03.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_03"></kbd> |
| <kbd><img src="img/04.png" width="80%" height="90%" alt="RoomReservationMicroServicesReact_04"></kbd> | <kbd><img src="img/05.png" width="70%" height="90%" alt="RoomReservationMicroServicesReact_05"></kbd> | <kbd><img src="img/06.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_06"></kbd> |
| <kbd><img src="img/07.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_07"></kbd> | <kbd><img src="img/08.png" width="60%" height="90%" alt="RoomReservationMicroServicesReact_08"></kbd> | <kbd><img src="img/09.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_09"></kbd> |
| <kbd><img src="img/10.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_10"></kbd> | <kbd><img src="img/11.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_11"></kbd> | <kbd><img src="img/12.png" width="60%" height="90%" alt="RoomReservationMicroServicesReact_12"></kbd> |
| <kbd><img src="img/13.png" width="90%" height="90%" alt="RoomReservationMicroServicesReact_13"></kbd> |


## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Microservices Backend**: Ensure the backend services are running.

### Installation

1. Clone the repository:

   ```bash
   cd RoomReservationMicroServicesReact
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:5173](http://localhost:5173) in your browser.

3. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

[DeepWiki moraisLuismNet/RoomReservationMicroServicesReact](https://deepwiki.com/moraisLuismNet/RoomReservationMicroServicesReact)
