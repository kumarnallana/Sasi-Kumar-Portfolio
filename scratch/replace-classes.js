const fs = require('fs');

const files = [
  'src/components/shell/HudFrame.tsx',
  'src/components/audio/SoundToggle.tsx',
  'src/components/navigation/DepthNav.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (file.includes('SoundToggle')) {
    // Specifically fix SoundToggle's size overrides
    content = content.replace(/tech-label pointer-events-none mt-\[1px\] text-\[0\.6rem\] transition-colors md:mt-0 md:text-xs/g, 'telemetry-text pointer-events-none transition-colors');
  } else if (file.includes('DepthNav')) {
    // For DepthNav, replace tech-label and also clean up text-[0.6rem]
    content = content.replace(/tech-label/g, 'telemetry-text');
    content = content.replace(/text-\[0\.6rem\]/g, ''); // Removes override since telemetry-text is 11px and micro is 10px
    content = content.replace(/text-\[0\.55rem\]/g, ''); // Replace small mobile jumps
  } else {
    // HudFrame
    content = content.replace(/className="tech-label/g, 'className="telemetry-text');
    content = content.replace(/className="tech-label /g, 'className="telemetry-text ');
  }
  fs.writeFileSync(file, content);
}

console.log("Replacement complete.");
