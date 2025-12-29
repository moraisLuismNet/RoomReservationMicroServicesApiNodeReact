const { execSync, exec } = require('child_process');

/**
 * Robust startup script to handle Docker Compose and automatic browser opening.
 * Supports a --build flag to rebuild images.
 */

const args = process.argv.slice(2);
const shouldBuild = args.includes('--build');

console.log(shouldBuild ? 'Rebuilding and starting Docker containers...' : 'Starting Docker containers...');

try {
    // Run docker-compose
    const composeCmd = shouldBuild ? 'docker-compose up -d --build' : 'docker-compose up -d';
    execSync(composeCmd, { stdio: 'inherit' });
    
    console.log('\n--- Success! ---');
    console.log('Waiting 5 seconds for services to initialize before opening browser...');
    
    // Wait and then open the browser
    setTimeout(() => {
        const url = 'http://localhost:4200/';
        console.log(`Opening browser at ${url}`);
        
        let openCmd;
        switch (process.platform) {
            case 'win32':
                openCmd = `start "" "${url}"`;
                break;
            case 'darwin':
                openCmd = `open "${url}"`;
                break;
            default:
                openCmd = `xdg-open "${url}"`;
                break;
        }
        
        exec(openCmd, (error) => {
            if (error) {
                console.error(`Failed to open browser automatically: ${error.message}`);
                console.log(`Please open your browser and navigate to: ${url}`);
            } else {
                console.log('Browser opened successfully.');
            }
        });
    }, 5000);

} catch (error) {
    console.error('\n--- Error ---');
    console.error('Failed to start Docker containers.');
    console.error('Make sure Docker Desktop is running and you have permissions to run docker-compose.');
    console.error('Error details:', error.message);
    process.exit(1);
}
