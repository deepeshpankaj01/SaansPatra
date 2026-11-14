/**
 * Demo Dataset 2: Mumbai Coastal & Suburb Stations
 * Contains:
 * - Stuck sensor: Powai PM2.5 stuck at exactly 85.3 for 7 consecutive readings
 * - Duplicate rows (Bandra Kurla at 12:00)
 * - Headers with underscores: station_name, sampling_date, PM_2.5, PM_10, NO_2, SO_2, CO, O_3
 * - Dates in YYYY-MM-DD HH:MM format
 * - Stations: Bandra Kurla Complex, Worli Seaface, Powai Industrial
 */
export const DEMO_DATA_STUCK_SENSOR = `station_name,sampling_date,PM_2.5,PM_10,NO_2,SO_2,CO,O_3
Bandra Kurla,2025-01-14 02:00,78,145,45,18,1.2,30
Bandra Kurla,2025-01-14 06:00,92,168,58,22,1.6,24
Bandra Kurla,2025-01-14 10:00,115,210,72,28,2.1,38
Bandra Kurla,2025-01-14 12:00,85,155,50,20,1.4,55
Bandra Kurla,2025-01-14 12:00,85,155,50,20,1.4,55
Bandra Kurla,2025-01-14 16:00,80,148,48,19,1.3,62
Bandra Kurla,2025-01-14 20:00,105,190,65,25,1.9,45
Worli,2025-01-14 02:00,42,85,28,12,0.8,40
Worli,2025-01-14 06:00,48,92,34,14,0.9,35
Worli,2025-01-14 10:00,65,120,44,18,1.2,48
Worli,2025-01-14 14:00,52,98,36,15,1.0,60
Worli,2025-01-14 18:00,58,108,40,16,1.1,52
Worli,2025-01-14 22:00,62,115,42,17,1.2,45
Powai,2025-01-14 02:00,85.3,160,52,24,1.8,25
Powai,2025-01-14 05:00,85.3,162,54,25,1.9,22
Powai,2025-01-14 08:00,85.3,170,58,28,2.2,30
Powai,2025-01-14 11:00,85.3,165,55,26,2.0,45
Powai,2025-01-14 14:00,85.3,158,50,22,1.7,58
Powai,2025-01-14 17:00,85.3,164,53,24,1.8,50
Powai,2025-01-14 20:00,85.3,175,60,28,2.3,38`;
