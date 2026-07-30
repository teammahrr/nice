/* Word banks for the scramble game.
   Each category holds a big pool so repeat games keep feeling fresh.
   Words already used are remembered in localStorage and skipped next time. */

const WORD_BANKS = [
    {
        id: "food",
        name: "Food",
        emoji: "🍛",
        blurb: "Indian favourites plus famous western dishes",
        words: [
            "biryani", "samosa", "dosa", "idli", "vada", "pakora", "paneer tikka",
            "butter chicken", "chole bhature", "rajma", "dal makhani", "palak paneer",
            "aloo gobi", "chapati", "naan", "paratha", "poha", "upma", "pav bhaji",
            "vada pav", "misal pav", "dhokla", "khichdi", "korma", "rogan josh",
            "tandoori chicken", "seekh kebab", "malai kofta", "shahi paneer", "keema",
            "nihari", "haleem", "pulao", "raita", "chutney", "sambar", "rasam",
            "uttapam", "kathi roll", "momos", "thali", "biryani masala", "papad",
            "jalebi", "gulab jamun", "rasmalai", "kheer", "halwa", "barfi", "ladoo",
            "kulfi", "lassi", "masala chai", "falooda", "pani puri", "bhel puri",
            "sev puri", "dabeli", "aloo tikki", "butter naan", "malai chaap",
            "pizza", "burger", "pasta", "lasagna", "spaghetti", "risotto", "ravioli",
            "gnocchi", "carbonara", "macaroni", "garlic bread", "sandwich", "hot dog",
            "french fries", "caesar salad", "meatballs", "steak", "roast chicken",
            "mashed potato", "fish and chips", "shepherds pie", "quiche", "omelette",
            "pancakes", "waffles", "croissant", "bagel", "muffin", "pretzel",
            "cheesecake", "brownie", "apple pie", "tiramisu", "ice cream", "milkshake",
            "cupcake", "churros", "donut", "taco", "burrito", "nachos", "hummus",
            "falafel", "shawarma", "paella", "pepperoni"
        ]
    },
    {
        id: "uae",
        name: "Places in UAE",
        emoji: "🏙️",
        blurb: "Cities, landmarks and hangout spots",
        words: [
            "dubai", "abu dhabi", "sharjah", "ajman", "fujairah", "umm al quwain",
            "ras al khaimah", "al ain", "hatta", "liwa", "khorfakkan", "dibba",
            "masafi", "kalba", "dhaid", "jebel ali", "mirdif", "deira", "bur dubai",
            "karama", "satwa", "barsha", "jumeirah", "business bay", "downtown dubai",
            "dubai marina", "palm jumeirah", "bluewaters", "dubai creek", "silicon oasis",
            "international city", "motor city", "sports city", "media city",
            "burj khalifa", "burj al arab", "dubai mall", "dubai frame", "dubai fountain",
            "museum of the future", "global village", "miracle garden", "ain dubai",
            "atlantis", "aquaventure", "wild wadi", "ski dubai", "dubai zoo",
            "kite beach", "la mer", "city walk", "jumeirah beach", "al qudra",
            "safa park", "zabeel park", "mushrif park", "creek park", "dragon mart",
            "gold souk", "spice souk", "al fahidi", "al bastakiya", "al seef",
            "mall of the emirates", "ibn battuta mall", "dubai hills mall",
            "expo city", "img worlds", "motiongate", "dubai parks", "jumeirah mosque",
            "sheikh zayed mosque", "louvre abu dhabi", "qasr al watan", "emirates palace",
            "corniche", "yas island", "ferrari world", "yas waterworld", "warner bros world",
            "saadiyat island", "sir bani yas", "al reem island", "marina mall",
            "jebel jais", "marjan island", "al hamra", "al noor island", "blue souk",
            "sharjah aquarium", "al majaz", "al montazah", "fossil rock", "al qurm",
            "hatta dam", "showka", "shindagha", "al mamzar", "palm jebel ali",
            "dubai airport", "sheikh zayed road", "emirates hills", "arabian ranches"
        ]
    },
    {
        id: "accessories",
        name: "Accessories",
        emoji: "👜",
        blurb: "Everyday things you carry or wear",
        words: [
            "watch", "wallet", "purse", "handbag", "tote bag", "backpack", "laptop bag",
            "pouch", "belt", "sunglasses", "spectacles", "contact lens", "cap", "hat",
            "scarf", "gloves", "socks", "shoes", "sandals", "slippers", "sneakers",
            "shoelaces", "tie", "cufflinks", "bracelet", "necklace", "earrings", "ring",
            "anklet", "bangles", "nose pin", "bindi", "wristband", "pendant", "brooch",
            "hairband", "hair clip", "scrunchie", "hair tie", "comb", "hairbrush",
            "mirror", "perfume", "deodorant", "lip balm", "lipstick", "kajal",
            "makeup kit", "nail cutter", "nail polish", "tweezers", "razor", "toothbrush",
            "sanitizer", "tissue", "face mask", "handkerchief", "towel", "keychain",
            "keys", "phone case", "screen guard", "charger", "power bank", "headphones",
            "earbuds", "smartwatch", "fitness band", "umbrella", "raincoat",
            "water bottle", "coffee mug", "lunch box", "notebook", "diary", "pen",
            "pencil", "eraser", "sharpener", "marker", "highlighter", "sticky notes",
            "calculator", "lanyard", "id badge", "passport holder", "card holder",
            "coin pouch", "shopping bag", "gym bag", "yoga mat", "cushion cover",
            "sleeping mask", "neck pillow", "flask", "wallet chain", "pocket knife",
            "torch", "sewing kit", "shoe brush", "safety pin", "hair oil"
        ]
    },
    {
        id: "animals",
        name: "Animals",
        emoji: "🦊",
        blurb: "From house pets to jungle giants",
        words: [
            "elephant", "tiger", "lion", "leopard", "cheetah", "jaguar", "panther",
            "giraffe", "zebra", "hippopotamus", "rhinoceros", "buffalo", "bison",
            "camel", "horse", "donkey", "cow", "goat", "sheep", "pig", "deer",
            "antelope", "kangaroo", "koala", "panda", "polar bear", "grizzly bear",
            "wolf", "fox", "coyote", "hyena", "jackal", "raccoon", "badger", "otter",
            "beaver", "squirrel", "chipmunk", "rabbit", "hare", "hedgehog", "porcupine",
            "mongoose", "meerkat", "monkey", "gorilla", "chimpanzee", "orangutan",
            "baboon", "lemur", "sloth", "armadillo", "anteater", "bat", "mouse", "rat",
            "hamster", "guinea pig", "ferret", "cat", "dog", "puppy", "kitten",
            "dolphin", "whale", "shark", "octopus", "squid", "jellyfish", "starfish",
            "seahorse", "crab", "lobster", "shrimp", "turtle", "tortoise", "crocodile",
            "alligator", "lizard", "chameleon", "iguana", "gecko", "snake", "cobra",
            "python", "frog", "toad", "salamander", "eagle", "hawk", "falcon", "owl",
            "parrot", "peacock", "pigeon", "sparrow", "crow", "flamingo", "penguin",
            "ostrich", "pelican", "swan", "duck", "goose", "chicken", "rooster",
            "turkey", "woodpecker", "kingfisher", "hummingbird", "butterfly",
            "dragonfly", "ladybug", "grasshopper", "scorpion", "spider", "snail"
        ]
    },
    {
        id: "countries",
        name: "Countries",
        emoji: "🌍",
        blurb: "Nations from every corner of the map",
        words: [
            "india", "pakistan", "bangladesh", "sri lanka", "nepal", "bhutan",
            "maldives", "afghanistan", "china", "japan", "south korea", "mongolia",
            "vietnam", "thailand", "cambodia", "laos", "myanmar", "malaysia",
            "singapore", "indonesia", "philippines", "brunei", "kazakhstan",
            "uzbekistan", "iran", "iraq", "turkey", "syria", "lebanon", "jordan",
            "israel", "saudi arabia", "yemen", "oman", "qatar", "bahrain", "kuwait",
            "egypt", "libya", "tunisia", "algeria", "morocco", "sudan", "ethiopia",
            "kenya", "uganda", "tanzania", "rwanda", "somalia", "nigeria", "ghana",
            "senegal", "mali", "cameroon", "angola", "zambia", "zimbabwe", "botswana",
            "namibia", "south africa", "mozambique", "madagascar", "mauritius",
            "russia", "ukraine", "poland", "germany", "france", "spain", "portugal",
            "italy", "greece", "switzerland", "austria", "belgium", "netherlands",
            "denmark", "norway", "sweden", "finland", "iceland", "ireland", "scotland",
            "england", "wales", "hungary", "romania", "bulgaria", "serbia", "croatia",
            "slovakia", "slovenia", "albania", "estonia", "latvia", "lithuania",
            "canada", "mexico", "cuba", "jamaica", "panama", "costa rica", "guatemala",
            "colombia", "venezuela", "brazil", "argentina", "chile", "peru", "bolivia",
            "ecuador", "uruguay", "paraguay", "australia", "new zealand", "fiji",
            "papua new guinea", "samoa", "tonga"
        ]
    }
];
