// Global in-memory store for Hackathon
export const mockDb = {
    users: [
        {
            "id": "1",
            "phone_number": "9999999999",
            "role": "farmer",
            "name": "Ramesh"
        },
        {
            "id": "2",
            "phone_number": "8888888888",
            "role": "warehouse_owner",
            "name": "Suresh"
        },
        {
            "id": "3",
            "phone_number": "7777777777",
            "role": "vehicle_provider",
            "name": "Driver Raju"
        }
    ] as any[],
    warehouses: [
        {
            "id": "w_gen_1",
            "owner_id": "2",
            "name": "Agri Godown 1 (Dry)",
            "type": "standard",
            "latitude": 17.2544630343728,
            "longitude": 78.5196308281223,
            "total_capacity_tons": 636,
            "available_capacity_tons": 379,
            "price_per_ton_day": 23
        },
        {
            "id": "w_gen_2",
            "owner_id": "2",
            "name": "Agri Godown 2 (Cold)",
            "type": "cold_storage",
            "latitude": 17.35121868405158,
            "longitude": 78.6372806678926,
            "total_capacity_tons": 858,
            "available_capacity_tons": 214,
            "price_per_ton_day": 71
        },
        {
            "id": "w_gen_3",
            "owner_id": "2",
            "name": "Agri Godown 3 (Dry)",
            "type": "standard",
            "latitude": 17.359629848783968,
            "longitude": 78.73260681420335,
            "total_capacity_tons": 106,
            "available_capacity_tons": 478,
            "price_per_ton_day": 21
        },
        {
            "id": "w_gen_4",
            "owner_id": "2",
            "name": "Agri Godown 4 (Dry)",
            "type": "standard",
            "latitude": 17.280152293616986,
            "longitude": 78.61414972834191,
            "total_capacity_tons": 770,
            "available_capacity_tons": 227,
            "price_per_ton_day": 39
        },
        {
            "id": "w_gen_5",
            "owner_id": "2",
            "name": "Agri Godown 5 (Cold)",
            "type": "cold_storage",
            "latitude": 17.55306876505125,
            "longitude": 78.3468310967185,
            "total_capacity_tons": 451,
            "available_capacity_tons": 118,
            "price_per_ton_day": 69
        },
        {
            "id": "w_gen_6",
            "owner_id": "2",
            "name": "Agri Godown 6 (Cold)",
            "type": "cold_storage",
            "latitude": 17.5316577679039,
            "longitude": 78.68302683854468,
            "total_capacity_tons": 267,
            "available_capacity_tons": 256,
            "price_per_ton_day": 89
        },
        {
            "id": "w_gen_7",
            "owner_id": "2",
            "name": "Agri Godown 7 (Dry)",
            "type": "standard",
            "latitude": 17.44005403700965,
            "longitude": 78.23690019471756,
            "total_capacity_tons": 612,
            "available_capacity_tons": 508,
            "price_per_ton_day": 25
        },
        {
            "id": "w_gen_8",
            "owner_id": "2",
            "name": "Agri Godown 8 (Dry)",
            "type": "standard",
            "latitude": 17.226983263987286,
            "longitude": 78.66963777038615,
            "total_capacity_tons": 676,
            "available_capacity_tons": 453,
            "price_per_ton_day": 26
        },
        {
            "id": "w_gen_9",
            "owner_id": "2",
            "name": "Agri Godown 9 (Cold)",
            "type": "cold_storage",
            "latitude": 17.262157328998676,
            "longitude": 78.58478755354604,
            "total_capacity_tons": 862,
            "available_capacity_tons": 372,
            "price_per_ton_day": 80
        },
        {
            "id": "w_gen_10",
            "owner_id": "2",
            "name": "Agri Godown 10 (Dry)",
            "type": "standard",
            "latitude": 17.31415007932392,
            "longitude": 78.55336676099462,
            "total_capacity_tons": 630,
            "available_capacity_tons": 238,
            "price_per_ton_day": 34
        },
        {
            "id": "w_gen_11",
            "owner_id": "2",
            "name": "Agri Godown 11 (Cold)",
            "type": "cold_storage",
            "latitude": 17.451459411180387,
            "longitude": 78.47232431904655,
            "total_capacity_tons": 244,
            "available_capacity_tons": 357,
            "price_per_ton_day": 69
        },
        {
            "id": "w_gen_12",
            "owner_id": "2",
            "name": "Agri Godown 12 (Dry)",
            "type": "standard",
            "latitude": 17.598570089158798,
            "longitude": 78.39526873196363,
            "total_capacity_tons": 664,
            "available_capacity_tons": 291,
            "price_per_ton_day": 34
        },
        {
            "id": "w_gen_13",
            "owner_id": "2",
            "name": "Agri Godown 13 (Dry)",
            "type": "standard",
            "latitude": 17.32032279496764,
            "longitude": 78.34783327711477,
            "total_capacity_tons": 884,
            "available_capacity_tons": 459,
            "price_per_ton_day": 34
        },
        {
            "id": "w_gen_14",
            "owner_id": "2",
            "name": "Agri Godown 14 (Dry)",
            "type": "standard",
            "latitude": 17.195451323061153,
            "longitude": 78.66869464439483,
            "total_capacity_tons": 762,
            "available_capacity_tons": 404,
            "price_per_ton_day": 29
        },
        {
            "id": "w_gen_15",
            "owner_id": "2",
            "name": "Agri Godown 15 (Dry)",
            "type": "standard",
            "latitude": 17.227763094426567,
            "longitude": 78.51503261807441,
            "total_capacity_tons": 421,
            "available_capacity_tons": 161,
            "price_per_ton_day": 31
        },
        {
            "id": "w_gen_16",
            "owner_id": "2",
            "name": "Agri Godown 16 (Dry)",
            "type": "standard",
            "latitude": 17.38354430757611,
            "longitude": 78.27469223667498,
            "total_capacity_tons": 630,
            "available_capacity_tons": 269,
            "price_per_ton_day": 36
        },
        {
            "id": "w_gen_17",
            "owner_id": "2",
            "name": "Agri Godown 17 (Dry)",
            "type": "standard",
            "latitude": 17.395348038116015,
            "longitude": 78.51228273492698,
            "total_capacity_tons": 502,
            "available_capacity_tons": 97,
            "price_per_ton_day": 34
        },
        {
            "id": "w_gen_18",
            "owner_id": "2",
            "name": "Agri Godown 18 (Dry)",
            "type": "standard",
            "latitude": 17.56309797241534,
            "longitude": 78.66157562904101,
            "total_capacity_tons": 478,
            "available_capacity_tons": 410,
            "price_per_ton_day": 35
        },
        {
            "id": "w_gen_19",
            "owner_id": "2",
            "name": "Agri Godown 19 (Dry)",
            "type": "standard",
            "latitude": 17.291337722008098,
            "longitude": 78.28146680511196,
            "total_capacity_tons": 254,
            "available_capacity_tons": 318,
            "price_per_ton_day": 22
        },
        {
            "id": "w_gen_20",
            "owner_id": "2",
            "name": "Agri Godown 20 (Cold)",
            "type": "cold_storage",
            "latitude": 17.247383060012638,
            "longitude": 78.37394627922258,
            "total_capacity_tons": 846,
            "available_capacity_tons": 202,
            "price_per_ton_day": 95
        },
        {
            "id": "w_gen_21",
            "owner_id": "2",
            "name": "Agri Godown 21 (Dry)",
            "type": "standard",
            "latitude": 17.334784019364818,
            "longitude": 78.24110032634414,
            "total_capacity_tons": 968,
            "available_capacity_tons": 459,
            "price_per_ton_day": 37
        },
        {
            "id": "w_gen_22",
            "owner_id": "2",
            "name": "Agri Godown 22 (Cold)",
            "type": "cold_storage",
            "latitude": 17.186531873022577,
            "longitude": 78.49280759736605,
            "total_capacity_tons": 958,
            "available_capacity_tons": 308,
            "price_per_ton_day": 91
        },
        {
            "id": "w_gen_23",
            "owner_id": "2",
            "name": "Agri Godown 23 (Dry)",
            "type": "standard",
            "latitude": 17.36053149470555,
            "longitude": 78.36655587279579,
            "total_capacity_tons": 655,
            "available_capacity_tons": 43,
            "price_per_ton_day": 31
        },
        {
            "id": "w_gen_24",
            "owner_id": "2",
            "name": "Agri Godown 24 (Dry)",
            "type": "standard",
            "latitude": 17.25777707464202,
            "longitude": 78.68338745344118,
            "total_capacity_tons": 218,
            "available_capacity_tons": 306,
            "price_per_ton_day": 31
        },
        {
            "id": "w_gen_25",
            "owner_id": "2",
            "name": "Agri Godown 25 (Dry)",
            "type": "standard",
            "latitude": 17.566008937718635,
            "longitude": 78.4748549374867,
            "total_capacity_tons": 297,
            "available_capacity_tons": 470,
            "price_per_ton_day": 21,
            "contact_number": "9848011234"
        }
    ] as any[],
    vehicles: [
        {
            "id": "v_gen_1",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS55AB3657",
            "latitude": 17.494337535464823,
            "longitude": 78.19451215912903,
            "name": "Eicher Mini Truck",
            "contact_number": "9848011234",
            "color_code": "#FF0000"
        },
        {
            "id": "v_gen_2",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS84AB3961",
            "latitude": 17.141288337082337,
            "longitude": 78.27889229069642,
            "name": "Ashok Leyland Lorry"
        },
        {
            "id": "v_gen_3",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS61AB3160",
            "latitude": 17.59371682413879,
            "longitude": 78.48529518272849,
            "name": "Ashok Leyland Lorry"
        },
        {
            "id": "v_gen_4",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS84AB1710",
            "latitude": 17.286463590089383,
            "longitude": 78.34120864463276,
            "name": "Swaraj Tractor"
        },
        {
            "id": "v_gen_5",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS75AB4524",
            "latitude": 17.154488038063914,
            "longitude": 78.48450474325489,
            "name": "Swaraj Tractor"
        },
        {
            "id": "v_gen_6",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS64AB7349",
            "latitude": 17.27047887867136,
            "longitude": 78.65050644429407,
            "name": "Mahindra Tractor"
        },
        {
            "id": "v_gen_7",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS79AB3592",
            "latitude": 17.61437131966551,
            "longitude": 78.48131072362146,
            "name": "Mahindra Tractor"
        },
        {
            "id": "v_gen_8",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS90AB9044",
            "latitude": 17.32657692848881,
            "longitude": 78.61198734875049,
            "name": "Mahindra Tractor"
        },
        {
            "id": "v_gen_9",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS57AB5466",
            "latitude": 17.52123228138906,
            "longitude": 78.47867973103759,
            "name": "Swaraj Tractor"
        },
        {
            "id": "v_gen_10",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS10AB9256",
            "latitude": 17.470728422195105,
            "longitude": 78.65366883798674,
            "name": "Ashok Leyland Lorry"
        },
        {
            "id": "v_gen_11",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS49AB1504",
            "latitude": 17.41498499518071,
            "longitude": 78.73385099684117,
            "name": "Eicher Mini Truck"
        },
        {
            "id": "v_gen_12",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS94AB5933",
            "latitude": 17.452079955932415,
            "longitude": 78.5160638993702,
            "name": "Eicher Mini Truck"
        },
        {
            "id": "v_gen_13",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS90AB1837",
            "latitude": 17.219894430592365,
            "longitude": 78.6703483978118,
            "name": "Eicher Mini Truck"
        },
        {
            "id": "v_gen_14",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS33AB5048",
            "latitude": 17.456202184986104,
            "longitude": 78.78517861105824,
            "name": "Tata Ace"
        },
        {
            "id": "v_gen_15",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS99AB4703",
            "latitude": 17.599921650047133,
            "longitude": 78.73223275776125,
            "name": "Swaraj Tractor"
        },
        {
            "id": "v_gen_16",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS66AB5106",
            "latitude": 17.246469639641315,
            "longitude": 78.60125976796041,
            "name": "Eicher Mini Truck"
        },
        {
            "id": "v_gen_17",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS88AB4858",
            "latitude": 17.367894311822422,
            "longitude": 78.6610558671853,
            "name": "Ashok Leyland Lorry"
        },
        {
            "id": "v_gen_18",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS86AB2672",
            "latitude": 17.1880893823314,
            "longitude": 78.68049652958956,
            "name": "Ashok Leyland Lorry"
        },
        {
            "id": "v_gen_19",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS16AB9518",
            "latitude": 17.128503640043427,
            "longitude": 78.56378306335829,
            "name": "Mahindra Tractor"
        },
        {
            "id": "v_gen_20",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS48AB6510",
            "latitude": 17.649473924619954,
            "longitude": 78.57361252212914,
            "name": "Swaraj Tractor"
        },
        {
            "id": "v_gen_21",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS66AB7882",
            "latitude": 17.56214274082067,
            "longitude": 78.65404364841804,
            "name": "Mahindra Tractor"
        },
        {
            "id": "v_gen_22",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS23AB4714",
            "latitude": 17.451147485607926,
            "longitude": 78.46145310728986,
            "name": "Eicher Mini Truck"
        },
        {
            "id": "v_gen_23",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS89AB5321",
            "latitude": 17.435636758897562,
            "longitude": 78.40705958349308,
            "name": "Mahindra Tractor"
        },
        {
            "id": "v_gen_24",
            "provider_id": "3",
            "vehicle_type": "tractor",
            "vehicle_number": "TS23AB6297",
            "latitude": 17.672439541612462,
            "longitude": 78.61105229098992,
            "name": "Eicher Mini Truck"
        },
        {
            "id": "v_gen_25",
            "provider_id": "3",
            "vehicle_type": "lorry",
            "vehicle_number": "TS30AB7043",
            "latitude": 17.492721891795117,
            "longitude": 78.24685701565677,
            "name": "Swaraj Tractor"
        }
    ] as any[],
    bookings: [] as any[]
};

// Next.js API route dev mode caching helper
const globalForDb = global as unknown as { mockDb: typeof mockDb };
export const db = globalForDb.mockDb || mockDb;
if (process.env.NODE_ENV !== 'production') globalForDb.mockDb = db;
