# Hackathon Directory

A comprehensive directory of hackathons from around the world. Built with Next.js, TypeScript, and Tailwind CSS.

![Hackathon Directory Screenshot](./public/bg.webp)

## 📋 Features

- Browse a curated list of hackathons
- Filter by upcoming and past events
- View hackathon details including date, location, prize, and more
- Responsive design for all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/imbjdd/hackathon-directory.git
   cd hackathon-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 How to Add a Hackathon

The hackathon data is stored in a YAML file located at `data/hackathons.yml`. To add a new hackathon:

1. Open the `data/hackathons.yml` file
2. Add a new entry following this format:

```yaml
- id: [unique-identifier]
  name: [Hackathon Name]
  date: [Date or Date Range]
  location: [Location or "Online"]
  category: [Blockchain, AI, General, etc.]
  prize: [Prize amount or ""]
  website: [Official website URL]
```

### Example:

```yaml
- id: devfest2025
  name: DevFest 2025
  date: October 15-17, 2025
  location: San Francisco, USA
  category: General
  prize: 50k$
  website: https://example.com/devfest2025
```

### Field Guidelines:

- **id**: A unique identifier for the hackathon (use lowercase, no spaces)
- **name**: The official name of the hackathon
- **date**: Use format "Month Day-Day, Year" or "Month Day, Year"
- **location**: City, Country or "Online"
- **category**: Main focus of the hackathon (e.g., Blockchain, AI, Web3, General)
- **prize**: Total prize pool (e.g., "50k$") or leave empty quotes "" if unknown
- **website**: Full URL to the official hackathon website

After adding your entry, save the file. The changes will be automatically reflected when the site is rebuilt.

## 🛠️ Technology Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [js-yaml](https://github.com/nodeca/js-yaml) for YAML parsing

## 📄 License

This project is open source and available under the MIT License.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://bjdd.vercel.app/"><img src="https://avatars.githubusercontent.com/u/56689216?v=4?s=100" width="100px;" alt="Salim"/><br /><sub><b>Salim</b></sub></a><br /><a href="#code-imbjdd" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://jordanbaumard.fr"><img src="https://avatars.githubusercontent.com/u/34632740?v=4?s=100" width="100px;" alt="Jordan"/><br /><sub><b>Jordan</b></sub></a><br /><a href="#code-jordanbmrd" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/carruc"><img src="https://avatars.githubusercontent.com/u/76063704?v=4?s=100" width="100px;" alt="Pietro Carrucciu "/><br /><sub><b>Pietro Carrucciu </b></sub></a><br /><a href="#code-carruc" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://andryr.dev"><img src="https://avatars.githubusercontent.com/u/6563044?v=4?s=100" width="100px;" alt="andryr"/><br /><sub><b>andryr</b></sub></a><br /><a href="#code-andryr" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
