import { cn } from "@/lib/utils";

/**
 * Stylized line-art outline of Italy (mainland, Sicily, Sardinia), as in the
 * idle mockup. Path points come from real coastline landmarks projected onto
 * the viewBox (x = (lon-6)*14, y = (47.5-lat)*19), smoothed with curves.
 * Purely decorative — hidden from assistive tech. Stroke color comes from
 * `currentColor`, so the parent sets it via a text-* token.
 */
export function ItalyMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 215"
      fill="none"
      aria-hidden="true"
      className={cn("h-auto", className)}
    >
      <path
        d="M14 30
           L30 22
           C45 12 60 8 77 12
           C88 14 98 14 108 19
           L109 30
           C104 36 96 38 88 40
           C90 44 91 46 91 50
           L92 66
           C96 70 100 71 105 74
           C109 81 112 89 115 96
           C121 100 127 103 133 106
           C137 105 141 106 143 109
           C147 114 150 118 153 122
           C158 125 163 127 168 130
           C172 133 174 137 175 141
           C175 144 174 146 173 146
           C171 145 169 143 168 142
           C164 138 160 136 157 134
           C153 138 150 142 147 146
           C150 151 153 155 155 160
           C153 163 150 164 148 165
           C146 171 143 177 140 182
           C138 184 136 184 135 182
           L135 179
           C136.5 175.5 137.5 174 138.5 172
           C140 169.5 140 168.5 140 167
           C138 160 136 150 134 142
           C128 136 121 131 115 126
           C112 123 109 121.5 106 120
           C99 116 93 113 87 110
           C81 105 76 101 71 97
           C68 94 65 90 63 87
           C62 83 61 79 60 76
           C58 72 55 68 53 65
           C49 62 45 60 41 59
           C36 62 31 65 28 68
           C25 69 23 70 21 71
           C17 65 14 58 13 51
           C12 44 13 37 14 30
           Z
           M134 176
           C124 176 113 177 103 178
           C99 180 94 182 90 184
           C94 189 105 195 116 198
           C121 200 126 201 130 201
           C129 197 128 193 127 190
           C129 185 132 180 134 176
           Z
           M45 119
           C48 121 51 123 52 125
           C53 131 53 137 53 142
           C50 147 47 153 43 158
           C42 160 40 162 40 163
           C37 157 35 151 34 144
           C33 138 31 132 31 126
           C35 124 40 121 45 119
           Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
