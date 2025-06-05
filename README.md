## dirTP
dirTP is a custom protocol designed to transfer large files with speed and reliability.

### Features
Chunked File Transmission: Efficiently splits large files into manageable chunks for transfer.

High-Speed Transfer: Optimized for rapid data transmission over networks.

Reliability: Implements retry mechanisms to handle failed chunks and ensure complete file delivery.

Integrity Checks: Ensures data integrity through checksum verification.

Scalability: Capable of handling files of substantial size without performance degradation.

### Project Structure
```bash
dirTP/
├── client.js        # Handles sending files
├── index.js         # Entry point for the application
├── utils/           # Utility functions and helpers
├── test.txt         # Sample file for testing
├── package.json     # Project metadata and dependencies
└── README.md        # Project documentation
```
### Installation
Clone the repository:

```bash
git clone https://github.com/vizzv/dirTP.git
cd dirTP
```
Install dependencies:

```bash
npm install
```

## Usage
Start the client:

```bash
node client.js
```

### License
This project is licensed under the MIT License.

### Author
Maintained by [Vizzv](https://github.com/vizzv).

### Contributors

