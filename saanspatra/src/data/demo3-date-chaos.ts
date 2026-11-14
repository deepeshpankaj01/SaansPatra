/**
 * Demo Dataset 3: Kolkata Metropolitan Area & Lower Gangetic Basin (TSV format)
 * Monitoring Network: West Bengal Pollution Control Board (WBPCB) CAAQMS
 *
 * Real-world anomalies embedded for deterministic engine verification:
 * - Date format chaos: ISO 8601, DD/MM/YYYY, MM-DD-YYYY, DD-Mon-YY, Unix epoch ms
 * - Non-standard column headers: Site, observation_time, fine_particulate, coarse_particulate, nitrogen_dioxide, sulphur_dioxide, carbon_monoxide, ozone
 * - Tab-separated values (TSV)
 * - Negative sensor noise (-15 at Howrah Station)
 * - Industrial winter smog peaks across Howrah transit hub, Victoria Memorial green buffer, and Jadavpur
 */
export const DEMO_DATA_DATE_CHAOS = `Site\tobservation_time\tfine_particulate\tcoarse_particulate\tnitrogen_dioxide\tsulphur_dioxide\tcarbon_monoxide\tozone
Salt Lake\t2025-01-14T02:00:00Z\t120\t220\t48\t18\t1.5\t28
Salt Lake\t14/01/2025 06:00\t145\t260\t62\t24\t2.1\t20
Salt Lake\t01-14-2025 10:00\t180\t310\t75\t30\t2.8\t35
Salt Lake\t14-Jan-25 14:00\t110\t195\t42\t16\t1.4\t58
Salt Lake\t1736877600000\t135\t240\t55\t22\t1.9\t48
Victoria Memorial\t2025-01-14T02:00:00Z\t65\t120\t32\t12\t0.9\t38
Victoria Memorial\t14/01/2025 06:00\t78\t140\t38\t14\t1.1\t32
Victoria Memorial\t01-14-2025 10:00\t95\t175\t46\t18\t1.4\t45
Victoria Memorial\t14-Jan-25 14:00\t70\t130\t35\t13\t1.0\t62
Victoria Memorial\t1736877600000\t82\t150\t40\t15\t1.2\t50
Howrah Station\t2025-01-14T02:00:00Z\t195\t340\t80\t35\t3.2\t22
Howrah Station\t14/01/2025 06:00\t230\t410\t95\t42\t4.0\t18
Howrah Station\t01-14-2025 10:00\t280\t480\t115\t52\t5.1\t28
Howrah Station\t14-Jan-25 14:00\t-15\t310\t68\t28\t2.6\t45
Howrah Station\t1736877600000\t215\t380\t88\t38\t3.6\t36
Jadavpur\t2025-01-14T02:00:00Z\t110\t198\t44\t16\t1.3\t30
Jadavpur\t14/01/2025 06:00\t132\t235\t56\t20\t1.8\t24
Jadavpur\t01-14-2025 10:00\t165\t285\t68\t26\t2.3\t38
Jadavpur\t14-Jan-25 14:00\t98\t175\t38\t14\t1.2\t52
Jadavpur\t1736877600000\t122\t218\t50\t18\t1.6\t42`;
