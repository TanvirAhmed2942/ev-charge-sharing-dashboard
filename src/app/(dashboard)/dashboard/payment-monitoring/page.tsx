"use client";

import PaymentMonitoring from "@/components/dashboard/paymentmonitoring/PaymentMonitoring";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";



export default function PaymentMonitoringPage() {
    return (
        <div className="space-y-6">
            <SmallPageInfo
                title="Payment Monitoring"
                description="Track and manage payment transactions"
            />
            <PaymentMonitoring />
        </div>
    );
}