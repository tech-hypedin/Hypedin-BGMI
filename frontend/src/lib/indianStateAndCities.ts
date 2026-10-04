export const INDIA_STATES: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const CITIES_BY_STATE: Record<string, string[]> = {
    'Andhra Pradesh': [
        'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Anantapur', 'Kadapa', 'Eluru', 'Vizianagaram', 'Ongole', 'Chittoor', 'Machilipatnam', 'Tenali', 'Proddatur', 'Adoni', 'Madanapalle', 'Hindupur', 'Nandyal', 'Bapatla', 'Amalapuram', 'Narasaraopet', 'Tadepalligudem', 'Palakollu', 'Gudivada', 'Bhimavaram', 'Srikakulam', 'Yemmiganur'
    ],
    'Arunachal Pradesh': [
        'Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Aalo', 'Roing', 'Namsai', 'Khonsa', 'Seppa', 'Daporijo', 'Yingkiong'
    ],
    'Assam': [
        'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Barpeta', 'Goalpara', 'Mangaldoi', 'Golaghat', 'Hojai', 'Lanka'
    ],
    'Bihar': [
        'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Nalanda', 'Hajipur', 'Saharsa', 'Sasaram', 'Motihari', 'Siwan', 'Kishanganj', 'Betiya', 'Dehri', 'Buxar', 'Samastipur', 'Madhubani', 'Jamui', 'Nawada', 'Sitamarhi', 'Aurangabad', 'Jehanabad'
    ],
    'Chhattisgarh': [
        'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Raigarh', 'Jagdalpur', 'Rajnandgaon', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Champa', 'Bhatapara', 'Kanker', 'Balod', 'Baloda Bazar', 'Kawardha', 'Kondagaon', 'Baikunthpur'
    ],
    'Goa': [
        'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda',  'Bicholim', 'Curchorem', 'Porvorim', 'Calangute', 'Candolim', 'Sanvordem', 'Valpoi', 'Quepem', 'Canacona'
    ],
    'Gujarat': [
        'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Navsari', 'Morbi', 'Bharuch', 'Vapi', 'Valsad', 'Mehsana', 'Bhuj', 'Porbandar', 'Surendranagar', 'Veraval', 'Godhra', 'Patan', 'Amreli', 'Botad', 'Dahod', 'Palanpur', 'Gondal', 'Jetpur', 'Deesa'
    ],
    'Haryana': [
        'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Karnal', 'Rohtak', 'Sonipat', 'Panchkula', 'Yamunanagar', 'Sirsa', 'Bahadurgarh', 'Jind', 'Rewari', 'Bhiwani', 'Palwal', 'Thanesar', 'Narnaul', 'Tohana', 'Kaithal', 'Kurukshetra', 'Fatehabad', 'Safidon'
    ],
    'Himachal Pradesh': [
        'Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Kullu', 'Bilaspur', 'Hamirpur', 'Baddi', 'Chamba', 'Una', 'Nahan', 'Paonta Sahib', 'Palampur', 'Kangra', 'Manali', 'Reckong Peo', 'Keylong', 'Jogindernagar'
    ],
    'Jharkhand': [
        'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Phusro', 'Chaibasa', 'Medininagar', 'Dumka', 'Sahibganj', 'Jhumri Telaiya', 'Ghatshila', 'Godda', 'Pakur', 'Lohardaga', 'Simdega'
    ],
    'Karnataka': [
        'Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Davanagere', 'Ballari', 'Tumakuru', 'Shivamogga', 'Kalaburagi', 'Udupi', 'Bidar', 'Hassan', 'Dharwad', 'Mandya', 'Hosapete', 'Raichur', 'Gadag', 'Bagalkot', 'Chikmagalur', 'Chitradurga', 'Kolar', 'Karwar', 'Sirsi', 'Vijayapura', 'Yadgir', 'Chamarajanagar'
    ],
    'Kerala': [
        'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad', 'Kottayam', 'Malappuram', 'Manjeri', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad', 'Kayamkulam', 'Pathanamthitta', 'Kasaragod', 'Muvattupuzha', 'Nedumangad', 'Perinthalmanna', 'Irinjalakuda'
    ],
    'Madhya Pradesh': [
        'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Satna', 'Rewa', 'Ratlam', 'Dewas', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Chhindwara', 'Bhind', 'Morena', 'Shivpuri', 'Guna', 'Vidisha', 'Mandsaur', 'Hoshangabad', 'Sehore', 'Neemuch', 'Datia', 'Shajapur', 'Tikamgarh', 'Seoni'
    ],
    'Maharashtra': [
        'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai', 'Nanded', 'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Ahmednagar', 'Chandrapur', 'Kalyan-Dombivli', 'Mira-Bhayandar', 'Vasai-Virar', 'Ulhasnagar', 'Bhiwandi', 'Malegaon', 'Dhule', 'Parbhani', 'Ichalkaranji', 'Satara', 'Yavatmal', 'Wardha', 'Beed', 'Osmanabad', 'Gondia', 'Washim', 'Hingoli', 'Ratnagiri', 'Sindhudurg'
    ],
    'Manipur': [
        'Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Chandel', 'Jiribam', 'Moirang', 'Noney'
    ],
    'Meghalaya': [
        'Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Cherrapunji', 'Williamnagar', 'Byrnihat', 'Resubelpara', 'Nongpoh', 'Baghmara', 'Mawkyrwat'
    ],
    'Mizoram': [
        'Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Saiha', 'Kolasib', 'Mamit', 'Lawngtlai', 'Saitual', 'Khawzawl'
    ],
    'Nagaland': [
        'Kohima', 'Dimapur', 'Mokokchung', 'Wokha', 'Tuensang', 'Zunheboto', 'Mon', 'Phek', 'Chümoukedima', 'Tseminyu', 'Longleng', 'Kiphire'
    ],
    'Odisha': [
        'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Balangir', 'Rayagada', 'Jeypore', 'Paradip', 'Talcher', 'Bargarh', 'Angul', 'Keonjhar', 'Dhenkanal', 'Koraput', 'Bhawanipatna'
    ],
    'Punjab': [
        'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Abohar', 'Khanna', 'Phagwara', 'Firozpur', 'Kapurthala','Ropar', 'Sri Muktsar Sahib', 'Barnala', 'Rajpura', 'Batala', 'Malerkotla', 'Nabha', 'Sunam', 'Zirakpur'
    ],
    'Rajasthan': [
        'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Sri Ganganagar', 'Bharatpur', 'Pali', 'Barmer', 'Chittorgarh', 'Jhunjhunu', 'Tonk', 'Kishangarh', 'Beawar', 'Hanumangarh', 'Dholpur', 'Nagaur', 'Jalore', 'Sawai Madhopur', 'Banswara', 'Jhalawar', 'Sirohi', 'Dungarpur'
    ],
    'Sikkim': [
        'Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Singtam', 'Rangpo', 'Jorethang', 'Soreng', 'Pakyong', 'Ravangla'
    ],
    'Tamil Nadu': [
        'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Ranipet', 'Nagercoil', 'Kancheepuram', 'Cuddalore', 'Hosur', 'Tiruppur', 'Kumbakonam', 'Karaikudi', 'Neyveli', 'Ambur', 'Nagapattinam', 'Pudukkottai', 'Sivakasi', 'Pollachi', 'Karur', 'Namakkal', 'Tenkasi', 'Virudhunagar', 'Mayiladuthurai'
    ],
    'Telangana': [
        'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Mancherial', 'Nirmal', 'Siddipet', 'Kothagudem', 'Kamareddy', 'Sangareddy', 'Jagtial',
        'Vikarabad', 'Wanaparthy', 'Medak'
    ],
    'Tripura': [
        'Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Ambassa', 'Belonia', 'Khowai', 'Sabroom', 'Ranirbazar', 'Sonamura', 'Kumarghat'
    ],
    'Uttar Pradesh': [
        'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Noida', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Greater Noida', 'Firozabad', 'Ayodhya', 'Lakhimpur', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Hapur', 'Mirzapur', 'Bulandshahr', 'Amroha', 'Fatehpur', 'Etawah', 'Orai', 'Basti', 'Gonda', 'Unnao', 'Raebareli', 'Sultanpur', 'Mainpuri', 'Banda', 'Pilibhit', 'Ballia', 'Mau', 'Azamgarh', 'Badaun'
    ],
    'Uttarakhand': [
        'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Nainital', 'Rishikesh', 'Kashipur', 'Pithoragarh', 'Mussoorie', 'Almora', 'Tehri', 'Pauri', 'Bageshwar', 'Ranikhet', 'Srinagar', 'Chamoli', 'Uttarkashi', 'Kotdwar'
    ],
    'West Bengal': [
        'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Kharagpur', 'Haldia', 'Jalpaiguri', 'Darjeeling', 'Kalyani', 'Habra', 'Baharampur', 'Bidhannagar', 'Kamarhati', 'Kulti', 'Naihati', 'Purulia', 'Balurghat', 'Raiganj', 'Cooch Behar', 'Alipurduar', 'Bankura', 'Krishnanagar'
    ],
    // Union Territories
    'Andaman and Nicobar Islands': ['Port Blair', 'Garacharma', 'Bambooflat', 'Mayabunder', 'Diglipur', 'Havelock Island', 'Rangat'],
    'Chandigarh': ['Chandigarh', 'Mani Majra'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa', 'Amli', 'Naroli', 'Dadra'],
    'Delhi': [
        'New Delhi', 'Delhi', 'Dwarka', 'Rohini', 'Saket', 'Karol Bagh', 'Pitampura', 'Vasant Kunj', 'Connaught Place', 'South Ext', 'Rajouri Garden', 'Laxmi Nagar', 'Shahdara', 'Vasant Vihar', 'Chanakyapuri', 'Hauz Khas', 'Chandni Chowk', 'Okhla', 'Mayur Vihar', 'Paschim Vihar', 'Janakpuri', 'Narela', 'Burari', 'Najafgarh', 'Model Town', 'Ashok Vihar'
    ],
    'Jammu and Kashmir': [
        'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Sopore', 'Samba', 'Poonch', 'Rajouri', 'Pulwama', 'Kupwara', 'Bandipora', 'Ganderbal', 'Kulgam', 'Doda'
    ],
    'Ladakh': ['Leh', 'Kargil', 'Diskit', 'Padum', 'Drass'],
    'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy', 'Kalpeni', 'Kiltan', 'Kadmat', 'Chetlat'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Yanam', 'Mahe', 'Ozhukarai', 'Villianur']
};