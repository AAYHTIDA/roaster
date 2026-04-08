export const roastTemplates = [
  (name, habits) =>
    `${name}, you really said "${habits[0]}" is a personality trait? Bestie, that's not a habit, that's a cry for help. The fact that you also do "${habits[1] || habits[0]}" tells me you have main character syndrome but forgot to write the plot. Touch grass. Immediately.`,

  (name, habits) =>
    `Okay ${name}, let's be real — "${habits[0]}" every day? You're chronically online AND chronically delusional. Your "${habits[1] || habits[0]}" era is giving 'I peaked in my imagination.' The WiFi in your head is worse than IIIT Kottayam's library connection.`,

  (name, habits) =>
    `${name} really woke up and chose "${habits[0]}" as a daily ritual. Iconic. Embarrassing. The same energy as someone who puts "${habits[1] || habits[0]}" on their LinkedIn. No thoughts, head empty, vibes only — and not the good kind.`,

  (name, habits) =>
    `Not ${name} out here doing "${habits[0]}" like it's a personality. Babe, "${habits[1] || habits[0]}" is not a flex, it's a red flag with fairy lights on it. You're giving 'NPC who thinks they're the main quest.' The mess food at IIIT has more character development than you.`,

  (name, habits) =>
    `${name}, the fact that "${habits[0]}" made your daily habits list is sending me to another dimension. Combined with "${habits[1] || habits[0]}"? You're not built different, you're just built weird. Go outside. Drink water. Reconsider everything.`,

  (name, habits) =>
    `Sir/Ma'am ${name}, "${habits[0]}" daily? That's not discipline, that's a coping mechanism with a vision board. Your "${habits[2] || habits[1] || habits[0]}" arc is giving 'villain origin story but make it mid.' The audacity is unmatched, the results are not.`,
];

export const complimentTemplates = [
  (name, habits) =>
    `${name}, the fact that you do "${habits[0]}" every single day? That's not just discipline — that's main character energy done RIGHT. You're the human equivalent of a fresh glazed donut: warm, sweet, and everyone's day gets better when you show up.`,

  (name, habits) =>
    `Okay ${name}, "${habits[0]}" as a daily habit? You're literally built different and I mean that in the best way. Your "${habits[1] || habits[0]}" era is giving 'person who actually has their life together.' The world needs more people like you, no cap.`,

  (name, habits) =>
    `${name}! You do "${habits[0]}" every day?! That's the kind of dedication that makes people stop and think 'wow, they've got it figured out.' You're like a sunrise — consistent, beautiful, and you make everything feel possible. "${habits[1] || habits[0]}" is just the cherry on top.`,

  (name, habits) =>
    `Not ${name} out here doing "${habits[0]}" like the absolute legend they are. You're the human equivalent of finding money in an old jacket — a delightful surprise that makes everything better. Your "${habits[1] || habits[0]}" habit? Chef's kiss. You're that person.`,

  (name, habits) =>
    `${name}, you're genuinely that rare person who does "${habits[0]}" and means it. In a world full of people who say they'll start Monday, you already started. You're giving 'cozy coffee shop on a rainy day' energy — safe, warm, and exactly what everyone needs.`,

  (name, habits) =>
    `Listen, ${name} — "${habits[0]}" every day is the kind of thing that quietly changes the world. You're not just building habits, you're building character. Your "${habits[2] || habits[1] || habits[0]}" game is immaculate. You're the friend everyone wishes they had. Genuinely iconic.`,
];

export const getBurnLevel = (index) => {
  const levels = [
    { label: 'Mild', percent: 20, color: 'from-yellow-400 to-orange-300' },
    { label: 'Medium', percent: 40, color: 'from-orange-400 to-orange-500' },
    { label: 'Hot', percent: 60, color: 'from-orange-500 to-red-500' },
    { label: 'Extra Hot', percent: 80, color: 'from-red-500 to-red-600' },
    { label: 'Third-Degree Burn', percent: 100, color: 'from-red-600 to-rose-900' },
  ];
  return levels[index % levels.length];
};
