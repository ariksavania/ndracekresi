export async function onRequest(context) {
    const url = new URL(context.request.url);
    const awb = url.searchParams.get('awb');
    const courier = url.searchParams.get('courier');

    if (!awb || !courier) {
        return Response.json(
            { error: 'Tracking number (awb) and courier are required.' }, 
            { status: 400 }
        );
    }

    // Prepare mock data
    const mockResponse = {
        status: 200,
        message: 'Successfully tracked package',
        data: {
            summary: {
                awb: awb,
                courier: courier.toUpperCase(),
                status: 'DELIVERED',
                date: new Date().toISOString(),
                desc: 'Paket telah diterima oleh YBS.',
                amount: 'Rp 15.000',
                weight: '1.2 kg'
            },
            detail: {
                origin: 'JAKARTA',
                destination: 'BANDUNG',
                shipper: 'SleekStore Official',
                receiver: 'Budi Santoso'
            },
            history: [
                {
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
                    desc: 'Paket telah diserahkan ke kurir oleh pengirim',
                    location: 'JAKARTA'
                },
                {
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
                    desc: 'Paket telah berangkat dari fasilitas transit',
                    location: 'JAKARTA SORTING CENTER'
                },
                {
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
                    desc: 'Paket telah tiba di fasilitas transit tujuan',
                    location: 'BANDUNG GATEWAY'
                },
                {
                    date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
                    desc: 'Paket sedang dibawa oleh kurir menuju alamat tujuan',
                    location: 'BANDUNG'
                },
                {
                    date: new Date().toISOString(),
                    desc: 'Paket telah diterima oleh YBS (Yang Bersangkutan)',
                    location: 'BANDUNG'
                }
            ].reverse() // Newest first
        }
    };

    // Simulate network delay using a Promise
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return the JSON response
    return Response.json(mockResponse);
}
