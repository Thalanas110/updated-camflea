#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of HTML files that contain alert() calls based on our grep search
const filesWithAlerts = [
    'feedback.html',
    'message_page.html', 
    'myconversation.html',
    'notification.html',
    'post_item.html',
    'recent.html',
    'recentt.html',
    'report.html',
    'transaction.html',
    'user_management.html',
    'ViewProfile.html',
    'View_other.html'
];

const publicDir = 'c:\\Users\\Adriaan Dimate\\Desktop\\Camflea\\public';

filesWithAlerts.forEach(filename => {
    const filePath = path.join(publicDir, filename);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if modal-system.js is already included
        if (!content.includes('modal-system.js')) {
            console.log(`Adding modal system to ${filename}`);
            
            // Find the first script tag and add modal-system.js before it
            const scriptRegex = /<script[^>]*>/i;
            const match = content.match(scriptRegex);
            
            if (match) {
                const insertPoint = content.indexOf(match[0]);
                const newScript = '    <script src="modal-system.js"></script>\n    ';
                content = content.slice(0, insertPoint) + newScript + content.slice(insertPoint);
                
                fs.writeFileSync(filePath, content);
                console.log(`✓ Updated ${filename}`);
            } else {
                // If no script tag found, try to add it in the head section
                const headCloseRegex = /<\/head>/i;
                if (content.match(headCloseRegex)) {
                    content = content.replace(headCloseRegex, '    <script src="modal-system.js"></script>\n</head>');
                    fs.writeFileSync(filePath, content);
                    console.log(`✓ Updated ${filename} (added to head)`);
                } else {
                    console.log(`⚠ Could not update ${filename} - no suitable insertion point found`);
                }
            }
        } else {
            console.log(`- ${filename} already has modal system`);
        }
    } else {
        console.log(`⚠ File not found: ${filename}`);
    }
});

console.log('Modal system addition completed!');
