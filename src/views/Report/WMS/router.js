export default [
    {
        path: '/report/dr-item',
        name: 'ReportDeliveryReturn',
        component: () => import("./DRItem/DRItemReport.vue"),
        meta: {
            auth: true,
            title: 'Delivery Return Item Report'
        }
    },
    {
        path: '/report/gr-item',
        name: 'ReportGoodsReceiptItem',
        component: () => import("./GRItem/GRItemReport.vue"),
        meta: {
            auth: true,
            title: 'Goods Receipt Item Report'
        }
    },
    {
        path: '/report/goods-transfer-item',
        name: 'ReportGoodsTransferItem',
        component: () => import("./GTItem/GTItemReport.vue"),
        meta: {
            auth: true,
            title: 'Goods Transfer Item Report'
        }
    },
    {
        path: '/report/report-product',
        name: 'ReportProduct',
        component: () => import("./Product/ProductReport.vue"),
        meta: {
            auth: true,
            title: 'Product Report'
        }
    },
    {
        path: '/report/report-stock',
        name: 'ReportStock',
        component: () => import("./Stock/StockReport.vue"),
        meta: {
            auth: true,
            title: 'Stock Report'
        }
    },
    {
        path: '/report/report-stock-log',
        name: 'ReportStockLog',
        component: () => import("./StockLog/StockLogReport.vue"),
        meta: {
            auth: true,
            title: 'Stock Log Report'
        }
    },
    {
        path: '/report/report-waste-log',
        name: 'ReportWasteLog',
        component: () => import("./WasteLog/WasteLogReport.vue"),
        meta: {
            auth: true,
            title: 'Waste Log Report'
        }
    },
    {
        path: '/report/movement-stock',
        name: 'ReportMovementStock',
        component: () => import("./StockMovement/StockMovementReport.vue"),
        meta: {
            auth: true,
            title: 'Stock Movement Report'
        }
    },
    {
        path: '/report/picking-order',
        name: 'ReportPicking',
        component: () => import("./Picking/ReportPicking.vue"),
        meta: {
            auth: true,
            title: 'Picking Report'
        }
    },
    {
        path: '/report/picking-order-item',
        name: 'ReportPickingOrderItem',
        component: () => import("./Picking/PickingOrderItemReport.vue"),
        meta: {
            auth: true,
            title: 'Picking Order Item Report'
        }
    },
    {
        path: '/report/delivery-order',
        name: 'ReportDeliveryOrder',
        component: () => import("./DeliveryOrder/DOReport.vue"),
        meta: {
            auth: true,
            title: 'Delivery Order Report'
        }
    },
    {
        path: '/report/delivery-order-item',
        name: 'ReportDeliveryOrderItem',
        component: () => import("./DeliveryOrder/DOItemReport.vue"),
        meta: {
            auth: true,
            title: 'Delivery Order Item Report'
        }
    },
    {
        path: '/report/packing',
        name: 'ReportPacking',
        component: () => import("./Packing/PackingReport.vue"),
        meta: {
            auth: true,
            title: 'Packing Report'
        }
    },
    {
        path: '/report/transfer-sku-item',
        name: 'ReportTransferSKUItem',
        component: () => import("./TransferSKU/TransferSKUItem.vue"),
        meta: {
            auth: true,
            title: 'Transfer SKU Report'
        }
    },
    {
        path: '/report/picking-routing',
        name: 'ReportPickingRouting',
        component: () => import("./PickingRouting/PickingRouting.vue"),
        meta: {
            auth: true,
            title: 'Picking Routing Report'
        }
    }
]