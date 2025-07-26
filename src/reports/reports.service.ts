import { Injectable } from '@nestjs/common';
import { ReportEntity } from 'src/reports/reports.entity';

@Injectable()
export class ReportService {
  constructor(private readonly reportEntity: ReportEntity) {}

  async getDriverWiseReport() {
    const query = `
      SELECT 
        d.driver_id,
        d.name AS driver_name,
        COUNT(t.trip_id) AS total_trips,
        COALESCE(SUM(t.revenue), 0) AS total_revenue,
        COALESCE(SUM(t.expenses), 0) AS total_expenses
      FROM drivers d
      LEFT JOIN trips t ON d.driver_id = t.driver_id AND t.is_active = TRUE
      WHERE d.is_active = TRUE
      GROUP BY d.driver_id, d.name
      ORDER BY d.driver_id DESC;
    `;
    return this.reportEntity.runRawQuery(query);
  }

  async getTruckWiseReport() {
    const query = `
      SELECT 
        tr.truck_id,
        tr.name AS truck_name,
        COUNT(t.trip_id) AS total_trips,
        COALESCE(SUM(t.revenue), 0) AS total_revenue,
        COALESCE(SUM(t.expenses), 0) AS total_expenses
      FROM trucks tr
      LEFT JOIN trips t ON tr.truck_id = t.truck_id AND t.is_active = TRUE
      WHERE tr.is_active = TRUE
      GROUP BY tr.truck_id, tr.name
      ORDER BY tr.truck_id DESC;
    `;
    return this.reportEntity.runRawQuery(query);
  }

  async getClientWiseReport(period: 'monthly' | 'yearly') {
    const dateFormat = period === 'monthly' ? 'YYYY-MM' : 'YYYY';
    const query = `
      SELECT 
        c.client_id,
        c.name AS client_name,
        TO_CHAR(t.trip_date, '${dateFormat}') AS period,
        COUNT(t.trip_id) AS total_trips,
        COALESCE(SUM(t.revenue), 0) AS total_revenue
      FROM clients c
      LEFT JOIN trips t ON c.client_id = t.client_id AND t.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.client_id, c.name, period
      ORDER BY c.client_id, period;
    `;
    return this.reportEntity.runRawQuery(query);
  }
}
