export const getColorNameFromHex = (hex) => {
  const cssColors = {
    Thistle: "#d8bfd8",
    Indigo: "#4b0082",
    RoyalBlue: "#4169e1",
    DarkBlue: "#00008b",
    SlateBlue: "#6a5acd",
    Purple: "#800080",
    Pink: "#ffc0cb",
    Violet: "#ee82ee",
    Blue: "#0000ff",
    Magenta: "#ff00ff",
    Plum: "#dda0dd",
    Orchid: "#da70d6",
    LightPink: "#ffb6c1",
    Lavender: "#e6e6fa",
    Black: "#000000",
    White: "#ffffff",
    Brown: "#bf4922",
    Red: "#ff0000",
    Green: "#00ff00",
  };

  const hexToCompare = hex?.toLowerCase();
  let closest = { name: 'Unknown', distance: Infinity };

  for (const [name, value] of Object.entries(cssColors)) {
    const dist = getColorDistance(hexToCompare, value);
    if (dist < closest.distance) {
      closest = { name, distance: dist };
    }
  }

  return closest.name;
};

const getColorDistance = (hex1, hex2) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
};

const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};
