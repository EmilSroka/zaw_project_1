CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color_hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    image_url VARCHAR(255),
    category_id INT REFERENCES categories(category_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);


------------------
-- Example Data --
------------------

INSERT INTO users (user_id, username, password_hash) VALUES
(1, 'admin', '$2y$10$XynWuETjC7qpLO69ww2/ae1ilbfiN20DUQfN8gxQczdDXG4TEZJdO');

INSERT INTO categories (category_id, name, color_hash) VALUES
(1, 'Kariera', '9fd1a1'),
(2, 'Edukacja', 'aed4f5');

INSERT INTO events (event_id, name, start_date, end_date, description, image_url, category_id) VALUES
(1, 'Rodowód i Google', '2022-02-06', '2023-12-31', 'Obecnie pracuję w Google, tworząc narzędzie dla analityków danych typu data lineage dla produktów Google Cloud.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png', 1),
(2, 'Pierwszy dzień w Netflix?', '2024-01-01', NULL, 'Od stycznia zaczynam pracę jako inżynier oprogramowania w Netflix ?', 'https://images.ctfassets.net/y2ske730sjqp/6bhPChRFLRxc17sR8jgKbe/6fa1c6e6f37acdc97ff635cf16ba6fb3/Logos-Readability-Netflix-logo.png', 1),
(3, 'Meandry początków w ???', '2020-07-01', '2021-01-31', 'Zaczynałem w Comrchu robiąc aplikacje webowe (fronted) do projektu klasy CRM dla BP Portugalia. Każdy jakoś zaczynał, prawda?', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Comarch_Logo.png/640px-Comarch_Logo.png', 1),
(4, 'Kraków i AGH', '2018-10-01', '2022-02-08', 'Studia na AGH. Informatyka. No tak to bywa, że zawsze się trochę studiuje.', 'https://uczelnie.info.pl/wp-content/uploads/2021/03/AGH_w_Krakowie_uczelnie_Krakow_800.jpg', 2),
(5, 'Warszawa i PW', '2022-03-01', NULL, 'Koń, jaki jest, każdy widzi. OKNO i informatyka. Jeszcze kawy brakuje.', 'https://www.ans.pw.edu.pl/var/ans/storage/images/wydzial/15-lecie-wydzialu/15-lecie-wydzialu-administracji-i-nauk-spolecznych/15416-1-pol-PL/15-lecie-Wydzialu-Administracji-i-Nauk-Spolecznych.png', 2);

