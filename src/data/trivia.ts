import type { TriviaQuestion } from '../types'

export const trivia: Record<number, TriviaQuestion | null> = {
  // Day 1
  11: { question: 'What percentage of Earth\'s water is fresh water available for human use?', options: ['Less than 1%', 'About 3%', 'About 10%', 'About 25%'], correctIndex: 0, timeLimit: 15 },
  12: { question: 'How many gallons of water does the average American use per day?', options: ['20 gallons', '50 gallons', '80 gallons', '150 gallons'], correctIndex: 2, timeLimit: 15 },
  13: { question: 'Which uses the most water in a typical household?', options: ['Dishwasher', 'Toilet flushing', 'Showering', 'Laundry'], correctIndex: 1, timeLimit: 15 },
  14: { question: 'How long can a person survive without water?', options: ['1 day', '3 days', '7 days', '14 days'], correctIndex: 1, timeLimit: 15 },
  15: { question: 'What is the largest source of fresh water on Earth?', options: ['Rivers', 'Lakes', 'Glaciers and ice caps', 'Underground aquifers'], correctIndex: 2, timeLimit: 15 },
  16: null,

  // Day 2
  21: { question: 'How much water does a leaky faucet waste per day?', options: ['1 gallon', '5 gallons', '10 gallons', '20 gallons'], correctIndex: 1, timeLimit: 15 },
  22: { question: 'What is the process called when water moves from the ground to the atmosphere?', options: ['Condensation', 'Precipitation', 'Evaporation', 'Filtration'], correctIndex: 2, timeLimit: 15 },
  23: { question: 'How many gallons of water does it take to produce one pound of beef?', options: ['100 gallons', '500 gallons', '1,000 gallons', '1,800 gallons'], correctIndex: 3, timeLimit: 15 },
  24: { question: 'What percentage of the human body is water?', options: ['About 30%', 'About 45%', 'About 60%', 'About 80%'], correctIndex: 2, timeLimit: 15 },
  25: { question: 'Which country has the most fresh water resources?', options: ['United States', 'China', 'Russia', 'Brazil'], correctIndex: 3, timeLimit: 15 },
  26: null,

  // Day 3
  31: { question: 'How much water can you save by turning off the tap while brushing teeth?', options: ['1 gallon', '4 gallons', '8 gallons', '12 gallons'], correctIndex: 2, timeLimit: 15 },
  32: { question: 'What is an aquifer?', options: ['A type of water filter', 'An underground layer of water-bearing rock', 'A water treatment plant', 'A type of reservoir'], correctIndex: 1, timeLimit: 15 },
  33: { question: 'How many gallons of water does a 10-minute shower use?', options: ['5 gallons', '10 gallons', '20 gallons', '40 gallons'], correctIndex: 2, timeLimit: 15 },
  34: { question: 'What is the main cause of water pollution worldwide?', options: ['Industrial waste', 'Agricultural runoff', 'Sewage', 'Oil spills'], correctIndex: 1, timeLimit: 15 },
  35: { question: 'How much of Earth\'s surface is covered by water?', options: ['About 50%', 'About 60%', 'About 71%', 'About 85%'], correctIndex: 2, timeLimit: 15 },
  36: null,

  // Day 4
  41: { question: 'What is the term for water that is safe to drink?', options: ['Distilled water', 'Potable water', 'Mineral water', 'Spring water'], correctIndex: 1, timeLimit: 15 },
  42: { question: 'How much water does it take to grow one orange?', options: ['5 gallons', '13 gallons', '25 gallons', '50 gallons'], correctIndex: 1, timeLimit: 15 },
  43: { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, timeLimit: 15 },
  44: { question: 'How often should you replace your home water filter?', options: ['Every month', 'Every 2-3 months', 'Every 6 months', 'Every year'], correctIndex: 2, timeLimit: 15 },
  45: { question: 'What is the chemical formula for water?', options: ['HO2', 'H2O', 'H2O2', 'OH'], correctIndex: 1, timeLimit: 15 },
  46: null,

  // Day 5
  51: { question: 'How many people worldwide lack access to clean drinking water?', options: ['100 million', '500 million', '1 billion', '2 billion'], correctIndex: 3, timeLimit: 15 },
  52: { question: 'What is the water cycle also known as?', options: ['Hydrological cycle', 'Aquatic cycle', 'Hydration cycle', 'Moisture cycle'], correctIndex: 0, timeLimit: 15 },
  53: { question: 'Which appliance uses the most water in the average home?', options: ['Dishwasher', 'Washing machine', 'Toilet', 'Shower'], correctIndex: 2, timeLimit: 15 },
  54: { question: 'How much water does a running garden hose use per minute?', options: ['1 gallon', '2 gallons', '4 gallons', '6 gallons'], correctIndex: 1, timeLimit: 15 },
  55: { question: 'What is the deepest point in the ocean?', options: ['Mariana Trench', 'Puerto Rico Trench', 'Java Trench', 'Tonga Trench'], correctIndex: 0, timeLimit: 15 },
  56: null,
}
