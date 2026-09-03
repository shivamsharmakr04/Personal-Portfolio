# Shivam Kumar Portfolio

A responsive personal portfolio website for Shivam Kumar, a Full Stack Developer. The site presents professional experience, technical skills, featured projects, training, certifications, and contact information in a single-page layout.

## Features

- Responsive single-page portfolio layout
- Hero section with resume download and project/contact links
- About section with profile image and technology stack
- Skills section covering frontend, backend, databases/cloud, and AI/ML
- Featured project showcase with GitHub links
- Experience and web development training timeline
- Certification links for completed internships and training
- Mobile navigation menu
- Scroll-triggered animations and animated statistics
- Scroll-to-top control and cursor glow effect
- Contact form submission through Web3Forms

## Project Structure

| File or folder | Purpose |
| --- | --- |
| `index.html` | Main page markup and portfolio content |
| `style.css` | Layout, responsive styles, visual effects, and animations |
| `script.js` | Menu behavior, scroll effects, counters, animations, and contact form handling |
| `Logo.png` | Browser favicon/logo asset |
| `Profile.jpeg` | Profile image used in the About section |
| `Shivam_Kumar_Resume.pdf` | Downloadable resume |
| `Amdox Web Deveploment Completion Certificate.pdf` | Amdox completion certificate |
| `Shivam Kumar - Certificate Happieloop.pdf` | Happieloop internship certificate |
| `Training Certificate in Web Developement.pdf` | Web development training certificate |

## Run Locally

This is a static website and does not require a build step or package installation.

1. Open the project folder in VS Code.
2. Open `index.html` directly in a browser, or serve the folder with a local static server.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## External Services

The page loads these resources from external services:

- Google Fonts: Inter and JetBrains Mono
- Font Awesome 6.4.0 via cdnjs
- Unsplash images for project cards
- Web3Forms API for contact form submissions

The contact form configuration is in `script.js`. Replace the Web3Forms access key there with the key for the intended deployment before publishing, and avoid committing private credentials.

## Customization

- Update portfolio text, project details, links, and contact information in `index.html`.
- Replace profile and document assets in the project root as needed.
- Adjust colors, spacing, responsive breakpoints, and animations in `style.css`.
- Update form behavior or the email service integration in `script.js`.
- Replace placeholder project demo links (`href="#"`) with live deployments when available.

## Deployment

Because the project is fully static, it can be deployed to GitHub Pages, Netlify, Vercel, or any static hosting provider. Upload the complete project folder so the HTML, CSS, JavaScript, images, and PDF documents keep their relative paths.

## Contact

The portfolio currently displays:

- Email: shivamsharmakr04@gmail.com
- Location: Dehradun, Uttarakhand
- GitHub: <https://github.com/shivamsharmakr04>
- LinkedIn: <https://www.linkedin.com/in/shivam-kumar-b0aab2209/>
