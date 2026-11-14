/**
 * Scenario 1: Delhi-NCR Winter Smog Surge (Official CPCB CAAQMS Stations)
 * Stations: Anand Vihar, ITO, Mandir Marg, RK Puram, Dwarka Sector 8
 * Forensic challenges:
 * - Mixed units: PM2.5 in ug/m3, PM10 in mg/m3 (requires 1000x multiplication), NO2 in ppb
 * - Missing values: NA, --, empty strings
 * - Sentinel error values: -999, 9999
 * - Extreme peak inversion readings (> 350 ug/m3)
 */
export const DEMO_DATA_MIXED_UNITS = `Station,Sampling_Date,PM2.5 (ug/m3),PM10 (mg/m3),NO2 (ppb),SO2 (ug/m3),CO (mg/m3),O3 (ug/m3)
Anand Vihar,14/01/2025 00:00,240,0.42,65,38,3.2,28
Anand Vihar,14/01/2025 04:00,285,0.49,72,42,4.1,18
Anand Vihar,14/01/2025 08:00,340,0.58,88,48,5.4,32
Anand Vihar,14/01/2025 12:00,210,0.38,55,34,3.0,65
Anand Vihar,14/01/2025 16:00,195,0.34,62,31,2.8,74
Anand Vihar,14/01/2025 20:00,275,0.46,-999,40,4.5,45
ITO,14/01/2025 00:00,165,0.28,52,24,2.4,35
ITO,14/01/2025 04:00,180,0.31,58,26,2.9,22
ITO,14/01/2025 08:00,225,0.39,70,32,3.8,40
ITO,14/01/2025 12:00,145,0.25,48,22,2.1,68
ITO,14/01/2025 16:00,NA,0.23,50,20,1.9,72
ITO,14/01/2025 20:00,190,0.33,64,28,3.2,50
Mandir Marg,14/01/2025 00:00,135,0.24,42,19,1.9,32
Mandir Marg,14/01/2025 04:00,150,0.26,46,21,2.2,25
Mandir Marg,14/01/2025 08:00,195,0.33,58,27,3.0,42
Mandir Marg,14/01/2025 12:00,120,0.21,38,18,1.7,68
Mandir Marg,14/01/2025 16:00,115,0.20,40,17,1.6,70
Mandir Marg,14/01/2025 20:00,160,0.28,50,23,2.4,48
RK Puram,14/01/2025 00:00,110,0.19,38,18,1.8,42
RK Puram,14/01/2025 04:00,125,0.21,42,20,2.1,30
RK Puram,14/01/2025 08:00,160,0.27,55,25,2.8,48
RK Puram,14/01/2025 12:00,95,0.16,34,15,1.5,75
RK Puram,14/01/2025 16:00,90,0.15,36,16,1.4,80
RK Puram,14/01/2025 20:00,135,0.23,--,22,2.3,55
Dwarka Sector 8,14/01/2025 00:00,130,0.22,44,19,2.0,38
Dwarka Sector 8,14/01/2025 04:00,145,0.25,49,21,2.3,26
Dwarka Sector 8,14/01/2025 08:00,185,0.31,61,28,3.1,44
Dwarka Sector 8,14/01/2025 12:00,115,0.20,40,18,1.7,70
Dwarka Sector 8,14/01/2025 16:00,105,0.18,42,17,1.6,76
Dwarka Sector 8,14/01/2025 20:00,150,0.26,53,24,2.5,52`;
