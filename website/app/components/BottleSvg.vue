<template>
  <!-- Hand-drawn glass bottle. Glass outline inherits currentColor; the rolled
       message-slip inside is BurzYellow. Two-colour, flat, never 3D. -->
  <svg
    viewBox="0 0 120 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Cork -->
    <rect
      x="48"
      y="6"
      width="24"
      height="22"
      rx="4"
      fill="currentColor"
      opacity="0.55"
    />
    <!-- Neck -->
    <path
      d="M50 28 H70 V52 Q70 60 76 66 L84 76"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      d="M70 28 H50 V52 Q50 60 44 66 L36 76"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
    />
    <!-- Body -->
    <path
      d="M36 76 Q24 92 24 120 V168 Q24 188 44 188 H76 Q96 188 96 168 V120 Q96 92 84 76"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Rolled message slip -->
    <g stroke="var(--color-burz-yellow-500)" stroke-width="3">
      <rect
        x="44"
        y="116"
        width="32"
        height="46"
        rx="6"
        fill="var(--color-burz-yellow-500)"
        opacity="0.18"
      />
      <line x1="52" y1="128" x2="68" y2="128" stroke-linecap="round" />
      <line x1="52" y1="139" x2="68" y2="139" stroke-linecap="round" />
      <line x1="52" y1="150" x2="62" y2="150" stroke-linecap="round" />
    </g>
    <!-- Glass highlight -->
    <path
      d="M40 100 Q34 116 34 140 V164"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      opacity="0.3"
    />
  </svg>
</template>
