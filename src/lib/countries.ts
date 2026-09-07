/**
 * Countries offered in the contact form's phone-field picker.
 *
 * Flags come from `country-flag-icons` (MIT) as inline SVG components — no
 * emoji (which render as plain letters on Windows) and no runtime network
 * dependency. The list is curated to the regions Win works with: Indonesia,
 * the GCC (hospitality), Australia/Singapore (certifications), and the
 * regional ASEAN / global markets.
 */
import type { ComponentType, HTMLAttributes, SVGAttributes } from 'react';
import {
  ID,
  SG,
  MY,
  BN,
  AU,
  SA,
  AE,
  QA,
  KW,
  BH,
  OM,
  TH,
  VN,
  PH,
  KR,
  JP,
  CN,
  IN,
  NL,
  DE,
  GB,
  US,
} from 'country-flag-icons/react/3x2';

// The package doesn't export its Props type; mirror it so the flag
// components typecheck when stored in the Country interface.
type FlagElement = HTMLElement & SVGElement;
type FlagProps = HTMLAttributes<FlagElement> & SVGAttributes<FlagElement>;

export interface Country {
  /** ISO 3166-1 alpha-2 */
  code: string;
  /** English display name */
  name: string;
  /** International dial code, e.g. '+62' */
  dialCode: string;
  Flag: ComponentType<FlagProps>;
}

export const COUNTRIES: Country[] = [
  { code: 'ID', name: 'Indonesia', dialCode: '+62', Flag: ID },
  { code: 'SG', name: 'Singapore', dialCode: '+65', Flag: SG },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', Flag: MY },
  { code: 'BN', name: 'Brunei', dialCode: '+673', Flag: BN },
  { code: 'AU', name: 'Australia', dialCode: '+61', Flag: AU },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', Flag: SA },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', Flag: AE },
  { code: 'QA', name: 'Qatar', dialCode: '+974', Flag: QA },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', Flag: KW },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', Flag: BH },
  { code: 'OM', name: 'Oman', dialCode: '+968', Flag: OM },
  { code: 'TH', name: 'Thailand', dialCode: '+66', Flag: TH },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', Flag: VN },
  { code: 'PH', name: 'Philippines', dialCode: '+63', Flag: PH },
  { code: 'KR', name: 'South Korea', dialCode: '+82', Flag: KR },
  { code: 'JP', name: 'Japan', dialCode: '+81', Flag: JP },
  { code: 'CN', name: 'China', dialCode: '+86', Flag: CN },
  { code: 'IN', name: 'India', dialCode: '+91', Flag: IN },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', Flag: NL },
  { code: 'DE', name: 'Germany', dialCode: '+49', Flag: DE },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', Flag: GB },
  { code: 'US', name: 'United States', dialCode: '+1', Flag: US },
];

export const DEFAULT_COUNTRY: Country = COUNTRIES[0];