# The Chesseract

A modern, responsive chess training website built with Next.js and Tailwind CSS.

## Project Status

This project is currently in development. We have implemented the following components:

- ✅ Project structure and configuration
- ✅ Basic layout with Navbar and Footer
- ✅ Homepage with hero section and feature overview
- ✅ Interactive chess board component
- ✅ Coaches page with profiles and detailed information
- ✅ Responsive design for mobile and desktop

Next steps:
- [ ] Implement course listing page
- [ ] Create blog functionality
- [ ] Develop user authentication
- [ ] Set up payment processing

## Project Overview

The Chesseract is a premium chess training platform that offers courses, coaching, and resources for chess players of all levels. The website features a multidimensional chess theme inspired by a tesseract, incorporating sleek design elements such as gradients, glassmorphism, and interactive effects.

## Features

- **Responsive Design:** Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices
- **Modern UI:** Clean, elegant interface with chess-themed design elements
- **Interactive Components:** Smooth animations, hover effects, and dynamic elements
- **Comprehensive Sections:**
  - Hero section with eye-catching visuals
  - About Us overview
  - Course listings with detailed information
  - Coach profiles with ratings, specialties, and available courses
  - Testimonials carousel
  - Blog articles
  - Upcoming events
  - Contact form
  - Newsletter signup
- **Interactive Chess Board:** Functional chess board where users can move pieces

### Homepage
- Interactive chess board
- Smooth animations
- Call-to-action buttons
- Elegant hero section

### Coaches Page
- Displays a list of chess coaches
- Coach cards with profile information
- Rating and achievement badges for each coach
- Click on a coach to view their detailed profile page

### Individual Coach Profiles
- Detailed coach biographies
- USCF and FIDE ratings display
- Achievement badges
- Specialties and expertise areas
- Available courses offered by each coach
- Contact and scheduling options
- Stylish glassmorphism UI

## Technology Stack

- **Next.js:** React framework for building the user interface
- **Tailwind CSS:** Utility-first CSS framework for styling
- **TypeScript:** For type safety and improved developer experience
- **Lucide Icons:** Comprehensive icon library
- **CSS Custom Properties:** For theme consistency and flexibility

## Design Elements

- **Color Scheme:** Black, white, and blue accents
- **Typography:** Montserrat (headings) and Open Sans (body text)
- **Effects:**
  - Gradient backgrounds and buttons
  - Glassmorphism (translucent blur) for cards and navigation
  - Interactive hover states
  - Smooth animations
  - Chess-themed overlays and patterns

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chesseract.git
   ```

2. Navigate to the project directory:
   ```
   cd chesseract
   ```

3. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit `http://localhost:3000`

For more detailed installation instructions, please see the [INSTALL.md](INSTALL.md) file.

## Project Structure

```
chesseract/
├── app/
│   ├── components/     # UI components
│   │   ├── ChessBoard.tsx  # Interactive chess board
│   │   ├── Footer.tsx      # Site footer
│   │   └── Navbar.tsx      # Navigation bar
│   ├── coaches/        # Coaches pages
│   │   ├── page.tsx        # Coaches listing
│   │   └── [id]/           # Dynamic coach profiles
│   │       └── page.tsx
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/
│   └── images/         # Static images
├── types/              # TypeScript type definitions
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
├── INSTALL.md          # Detailed installation guide
└── README.md           # Project documentation
```

## Customization

- **Colors:** Modify the color palette in `tailwind.config.js`
- **Content:** Update component content in the respective files
- **Images:** Replace placeholder images in the `public/images` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern chess websites and platforms
- Chess imagery and resources used with appropriate licensing 