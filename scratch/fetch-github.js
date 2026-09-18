const fs = require('fs');

async function main() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const tokenLine = env.split('\n').find(l => l.startsWith('GITHUB_TOKEN='));
  if (!tokenLine) {
    console.error("Token not found");
    return;
  }
  const token = tokenLine.split('=')[1].trim();

  const query = `
    query {
      user(login: "kumarnallana") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
  const days = weeks.flatMap(w => w.contributionDays);
  
  // Calculate Streak
  let streak = 0;
  const sortedDates = days.map(d => d.date).sort((a, b) => a.localeCompare(b));
  const counts = new Map(days.map(d => [d.date, d.contributionCount]));
  
  let cursor = sortedDates[sortedDates.length - 1];
  if ((counts.get(cursor) || 0) === 0) {
    cursor = previousIsoDate(cursor);
  }
  
  while ((counts.get(cursor) || 0) > 0) {
    streak += 1;
    cursor = previousIsoDate(cursor);
  }
  
  console.log('--- RECENT GITHUB DATES ---');
  days.slice(-30).forEach(d => console.log(`${d.date}: ${d.contributionCount}`));
  console.log(`\nComputed Streak: ${streak}`);
}

function previousIsoDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

main().catch(console.error);
