import Card from "../../components/Card";
import { mockPayments, mockRequests } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function InvoiceGeneration() {
  const payment = mockPayments[0];
  const req = mockRequests.find((r) => r.id === payment.requestId) || mockRequests[0];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Invoice</h1>
      <Card hover={false} className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-soft">
          <div>
            <h2 className="text-2xl font-bold"><span className="text-brand">Auto</span><span className="text-text-primary">Mend</span></h2>
            <p className="text-text-muted text-xs mt-1">MG Road, Bangalore, Karnataka</p>
            <p className="text-text-muted text-xs">info@automend.com</p>
          </div>
          <div className="text-right">
            <p className="text-text-primary font-bold text-lg">INVOICE</p>
            <p className="text-text-muted text-xs">#{payment.transactionId}</p>
            <p className="text-text-muted text-xs">{formatDate(payment.date)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Bill To</p>
            <p className="text-text-primary font-semibold">{payment.customerName}</p>
            <p className="text-text-muted text-xs">arjun@example.com</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Vehicle</p>
            <p className="text-text-primary font-semibold">{req.vehicleName}</p>
            <p className="text-text-muted text-xs">{req.licensePlate}</p>
          </div>
        </div>
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-soft">
              <th className="text-left py-2 text-text-primary text-sm font-semibold">Description</th>
              <th className="text-right py-2 text-text-primary text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-soft">
              <td className="py-3 text-text-primary text-sm">{payment.serviceName}</td>
              <td className="py-3 text-right text-brand font-semibold text-sm">{formatCurrency(payment.amount)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="py-3 text-text-primary font-bold">Total</td>
              <td className="py-3 text-right text-brand font-bold text-lg">{formatCurrency(payment.amount)}</td>
            </tr>
          </tfoot>
        </table>
        <div className="flex justify-between items-center pt-4 border-t border-soft">
          <p className="text-text-muted text-xs">Payment: {payment.paymentMethod}</p>
          <button className="bg-brand hover:bg-brand-hover text-[#0E0E0E] font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">🖨️ Print Invoice</button>
        </div>
      </Card>
    </div>
  );
}
