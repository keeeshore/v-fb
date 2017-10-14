-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Oct 14, 2017 at 02:24 AM
-- Server version: 5.5.55-38.8-log
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `kisho2au_vimonisha`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` varchar(10000) NOT NULL,
  `starttime` varchar(20) NOT NULL,
  `endtime` varchar(20) NOT NULL,
  `cover` varchar(100) NOT NULL,
  `uid` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `starttime`, `endtime`, `cover`, `uid`) VALUES
(4, 'Vimonisha Festive & Wedding Designer Show', 'The Vimonisha Festive & Wedding Show\nDate - 31st July & 1st August \nVenue: The Hyatt Regency ballroom\nTime - 11am to 8pm\n\nWebsite - www.vimonisha.com\nEmail - monisha@vimonisha.com\nContact - 09820043549\nEntry Free!\n\nWell curated by Monisha Gidwani, this edition of Vimonisha sparkles its way higher to provide a launch pad for designers from across the country to showcase their latest line of garments, from salwar suits, sarees to indo western clothes, jewelry ,footwear, handbags and other lifestyle products.\nVimonisha never fails or disappoints as it brings to you the latest show stoppers to Chennai each time.\n\nVimonisha Exhibition is Chennaiâ€™s most prestigious designer and lifestyle exhibition which provides a launch pad for designers from across India to showcase their range of garments, salwar suits, sarees, indo western clothes, jewellery ,footwear, handbags and other lifestyle products.\n\nCurated by Monisha Gidwani, The Vimonisha Exhibition is held thrice a year at a 5 star hotel in Chennai, and attracts the high end fashionistas, crÃ¨me de la crÃ¨me of Chennai , serious buyers, wholesalesers, merchandisers and exporters. Vimonisha exhibtions organises high end designer shows in chennai for the last 25 years, and is chennais most awaited and premium exhibition.', '2017-07-31 15:30:00', '2017-08-02 00:30:00', 'events/662855110576737.jpg', '662855110576737'),
(5, 'Vimonisha Indian Summer Wedding & Designer Show', 'The Vimonisha indian Summer Wedding & Designer Exhibition\nDate - 3rd & 4th April 2017\nVenue: The Hyatt Regency ballroom\nTime - 11am to 8pm\n\nWebsite - www.vimonisha.com\nEmail - monisha@vimonisha.com\nContact - 09820043549\nEntry Free!\n\nWell curated by Monisha Gidwani, this edition of Vimonisha sparkles its way higher to provide a launch pad for designers from across the country to showcase their latest line of garments, from salwar suits, sarees to indo western clothes, jewelry ,footwear, handbags and other lifestyle products.\nVimonisha never fails or disappoints as it brings to you the latest show stoppers to Chennai each time.\nReaching out to the blooming Wedding industry and giving them an opportunity to reach out to the cream audience in Chennai.\nFASHION | LIFESTYLE | WEDDING ESSENTIALS & MORE', '2017-04-03 15:30:00', '2017-04-05 00:30:00', 'events/624280137776773.jpg', '624280137776773'),
(6, 'Vimonisha Mega Style Souk', 'The Vimonisha Mega Style Souk\nDate - 23rd & 24th January 2017\nVenue: The Hyatt Regency ballroom\nTime - 11am to 8pm\n\nWebsite - www.vimonisha.com\nEmail - monisha@vimonisha.com\nContact - 09820043549\nEntry Free!\n\nWell curated by Monisha Gidwani, this edition of Vimonisha sparkles its way higher to provide a launch pad for designers from across the country to showcase their latest line of garments, from salwar suits, sarees to indo western clothes, jewelry ,footwear, handbags and other lifestyle products.\nVimonisha never fails or disappoints as it brings to you the latest show stoppers to Chennai each time.', '2017-01-23 16:30:00', '2017-01-24 19:30:00', 'events/1819246368313368.jpg', '1819246368313368'),
(7, 'Vimonisha Prefestive Designer Exhibition', 'The Vimonisha Pre-Festive Designer Exhibition\nDate - 1st & 2nd August 2016\nVenue: The Hyatt Regency ballroom\nTime - 11am to 8pm\n\nWebsite - www.vimonisha.com\nEmail - monisha@vimonisha.com\nContact - 09820043549\nEntry Free!\n\nWell curated by Monisha Gidwani, this edition of Vimonisha sparkles its way higher to provide a launch pad for designers from across the country to showcase their latest line of garments, from salwar suits, sarees to indo western clothes, jewelry ,footwear, handbags and other lifestyle products.\nVimonisha never fails or disappoints as it brings to you the latest show stoppers to Chennai each time.', '2016-08-01 15:30:00', '2016-08-03 00:30:00', 'events/1045196835545942.jpg', '1045196835545942'),
(8, 'Vimonisha Indian Summer Designer Exhibition', 'The Vimonisha Indian Summer Designer Exhibition\nDate 29th & 30th March 2016\nVenue: The Hyatt Regency ballroom\nTime - 11am to 8pm\n\nWebsite - www.vimonisha.com\nEmail - monisha@vimonisha.com\nContact - 09820043549\nEntry Free!\n\nWell curated by Monisha Gidwani, this edition of Vimonisha sparkles its way higher to provide a launch pad for designers from across the country to showcase their latest line of garments, from salwar suits, sarees to indo western clothes, jewelry ,footwear, handbags and other lifestyle products.\nVimonisha never fails or disappoints as it brings to you the latest show stoppers to Chennai each time.', '2016-03-29 16:30:00', '2016-03-31 01:30:00', 'events/1395088987464710.jpg', '1395088987464710'),
(9, 'Vimonisha Mega Style Souk', 'The Vimonisha Mega Style Souk- Designer Exhibition\nDate 18th 19th Jan 2016\nVenue: The Hyatt Regency ballroom\n\nWebsite - www.vimonisha.com\nEmail - monisha@vimonisha.com\nContact - 09820043549\nEntry Free!\n\nWell curated by Monisha Gidwani, this edition of Vimonisha sparkles its way higher to provide a launch pad for designers from across the country to showcase their latest line of garments, from salwar suits, sarees to indo western clothes, jewelry ,footwear, handbags and other lifestyle products.\nVimonisha never fails or disappoints as it brings to you the latest show stoppers to Chennai each time.', '2016-01-18 16:30:00', '2016-01-20 01:30:00', 'events/default.jpg', '208064069530806'),
(10, 'Vimonisha Raksha Bandhan / PreDiwali Exhibition', 'Chennais most prestigious designer exhibition.\nCEO, Monisha Gidwani personally curates a platform for trendy & fine designers from all over the country to showcase their talent to the cream crowd. A fashion and lifestyle event with a luxury essence to kick start the festive season. Brand interests include latest fashion apparels, exclusive accessories, ethnic handicrafts, abode  dÃ©cor and jewelry among others.', '2015-08-05 15:30:00', '2015-08-07 00:30:00', 'events/1048658138497212.jpg', '1048658138497212'),
(11, 'Vimonisha Mega Style Souk', 'As Vimonisha Exhibitions completes 25 years of fashion \nexhibitions in Chennia,discerning fashionistas and shopping divas of Chennai will mark their calenders for the 17th and 18th of December as the Vimonisha Private Collection is back again with the seasons best pick of designers from Mumbai, Delhi, Kolkata, Hyderabad, Jaipur, Bangalore , Dubai and moreâ€¦.! The best Indian fashion designers  from the fashion industry and participating  fashion week designers and others will be present at Chennaiâ€™s fashion event especially curated and put together by Monisha Gidwani CEO  Vimonisha Exhibitions.', '2014-12-17 16:30:00', '2014-12-19 01:30:00', 'events/1518790101727068.jpg', '1518790101727068'),
(12, 'Vimonisha Raksha Bandhan Designer Exhibition', 'The Vimonisha Private Collection- The Raksha Bandhan Designer Exhibition and Lifestyle Exhibition and Sale\nHyatt Regency Chennai. 6th and 7th August 2014\nDiscerning fashionistas and shopping divas of Chennai will mark their calenders for the 6th and 7th August 2014 as the Vimonisha Private Collection is back again with the seasons best pick of designers from Mumbai, Delhi, Kolkata, Hyderabad, Jaipur, Bangalore , Dubai and moreâ€¦.! A listers from the fashion industry and participating  fashion week designers and others will be present at this augustâ€™s show. Mumbaiâ€™s Shruti Bhandari, Threads by Rita Bajaj, Nita Shah,Ayra Dubai,  Radhaâ€™s traditions, , Sony Mirpuri, Lana Cherry and other well known designers, will rub shoulders and complement their designer counterparts from Delhi, with Oorja, Turquoise, Kaahini, Aalankrit, among others. From Kolkata, Slice of Bengal with a wide range of sarees for the season too. Not to be outdone.. the south designers, will roll out their best creations, with  Sheetal Sharma,K clothing,Aarbys,  Dezires, Ana by Archana Reddy, Rihams Boutique, Ekanta Dysn, Susha,Vaaruni and  Vima, \nArmed with passion for artistic excellence and prompted by flair for eclectic designs, Shruti Bhandari  Mumbai, has carved a niche of her own in the world of fashion. \n\nHailing from a lineage of generations involved in manufacturing of fabrics and other creative pursuits, she has always had an artistic bent of mind and now designs for  various celebrities, TV Shows like Indian idol, Nach Baliye etc. Her Inspiration is drawn from varied sources and artisan techniques.The label is best known for its exquisitely classic yet stylish and timeless designs. The collection ranges from Exquisite Indian ethnic wear, Bridals, Trousseau, Gowns, Fashion garments,Tunics for Women to Sherwanis, Jodhpuries, Kurtas, Suits for Men.\n\nThreads by Rita Bajaj comes to exhibit at Vimonisha Private Collection with vibrant colours in Tunics and Kurtas. The cuts and styles are chic and elegant as she plays with different fabrics like georgettes, Italian shaded cotton silks, combination of tie and dyes, chanderis, and crepes.   \nThis season AARBYS  unveils designed silhouettes exclusively for Bridal and Wedding trousseau. Keeping MODESTY,STYLE AND ELEGANCE  with comfort quotient. Sarees , half sarees , lengha , anarkalis , kurtis and a lot more  too\n\n\nVAARUNI-with exquite traditional wear  showcases a stunning Fabric & Dupatta collection for women. \nThe extensive collection features Banaras Silk, Banaras Cotton, Maheshwari, Tussar Silk, Dupion Silk, Natural Dyes, Kota, Kora Silks & Cottons. The idea is to provide customers access to an extensive range of ethnic fabrics sourced and personally handpicked from different parts of the country.\n\n\nTo dazzle the Chennai socialites and crÃ¨me de la crÃ¨me, jewelers like Sunflower , Precious collection, Kohar, from Mumbai, along with Balaji, and Patni jewelers from Hyderabad, and trendy  range of fashion accessories by TeeAmo  and Boondh,will provide an eclectic selection of jewellery. Footwear and handbags by Adaa,Bottomline  and Shee shoe and home dÃ©cor by Haute DÃ©cor and Acacia Home Mumbai. Gifting solutions from Thejus and Sanskriti too.\n\nSays Monisha Gidwani CEO of Vimonisha Exhibitions,â€This season is all about highlighting your monochrome look with a hint of fuschia, lime green, cobalt blue or coralâ€¦ so our designers are busy creating their new lines for us.â€\n  Luscious skin treatment hampers from international cosmetic and skin treatment giant brands. Also vouchers to be won from Studio Profile Unisex Salon and Spa .  Fashion enthusiasts can avail of special subscription offers on Vogue magazine at the exhibition. You can also enjoy complementary vouchers from gourmet restaurant Burgundy. \nFor more information contact Monisha Gidwani 9820043549   monisha@vimonisha.com    www.vimonisha.com', '2014-08-06 15:30:00', '2014-08-08 00:30:00', 'events/256090241247764.jpg', '256090241247764'),
(13, 'The Vimonisha Mega style souk', 'The Vimonisha Private Collection- The Megastyle Souk wedding, trousseau, lifestyle Exhibition and Sale on 17th and 18th Dec  , AT  HYATT REGENCY CHENNAI\r\n\r\nStep into a world of fashion extraordinaire, at the annual Vimonisha Mege Style Souk ,a fashion exposition where 55 designers from across the country converge to show off their seasonâ€™s best creations and talent. Wedding and trousseau collections  of stunning sarees, suits, kurtas, afghani kurtis, fusionwear,rub shoulders with prÃªt wear, and fine jewellery with fashion accessories with kids wear too, so that this much awaited event has something for all the discerning Chennai lady fashionistas. This yearâ€™s special attraction is that established fashion week designers bring in a prÃªt line at  an exhibition for the first time in \r\nChennai!\r\nThis seasonâ€™s impressive line up are Anushree Reddy, the nationâ€™s latest favourite fashion designer, along with  Jayanti Reddy, Jayanti Reddy, yet another powerhouse of talent, is taking toddler steps into the giant world of fashion. Not more than two years old in the industry, she describes her sense of style to be eclectic and elegant, fused with natural fabrics and sleek cuts.  Radha Traditions and Rriso established brands from Mumbai, Nazar,  Jaykriti, Kclothing, Hema Kasturi, Sheetal Sharma, Change!, Garlic and Onion, Lemon Tree, Boondh,Amrisha, Shibhori, Sparsh, White Carnations, Sony Mirpuri, Ana by Archana Reddy, Dezires, Nesavaali, La bellaz, Alaankrit, Samaroho, Vima, Vastrasara, Susha, A& A boutique, Era,Cyra, Samyama, Turquoise, Giza&Pita  Pakistani garments, Monzaâ€™s fashion studio, Aarbys, Aryanâ€™s designer studio, Reins, Kashish Designer studio,Sakyaa, Stree Collections, Studio Silk. In the line up of jewellery, immensely talented Shikha of the celebrated brand Just Jewels bring exquisite handcrafted designs from Kolkata, Shillpa Purii with stunning creations in a range of dazzling stones and kundan.Sunflower, , and  Kohar, with jewellery.  Tint dÃ©cor, Haute DÃ©cor with home lifestyle products, Adaa, and Bottomline with bags and footwear, Nicole with kidswear too\r\n\r\nAnushree Reddyâ€™s traditional Indian silhouettes that embody femininity, enchantment, and are still young and vivacious; the label was created with the idea to craft clothes that are easy to wear and stunning. Her designs are supremely wardrobe-worthy.In no time, the label has mastered to offer a signature look that goes from Anarkalis, Sarees to Bridal Lehengas. Anushree Reddy brings to its customers silhouettes that are clean and cutting edge, with a flawless fusion of Indian & Western influences.\r\nâ€˜Anushree Reddyâ€™, a blend of Vintage Flamboyant Flora fused with age old Hyderabadizardozistands out for its burst of vivacious colours, drama, glamour, easy to wear pret and uber glam couture.The label â€˜Anushree Reddyâ€™ retails in Indiaâ€™s premium designer stores: Ensemble, Ogaan and Aza.\r\n\r\nGIZA & PITA â€“ AUTHENITIC PAKISTANI CLOTHING.. The collection includes kurtis, kaftans and shalwar kameez.GIZA & PITA also offers a complete, personalized Bridal and Trousseau Collection for brides to be. \r\nNesavaali is the first and only Indian designer brand that offers Shift dresses for women.  With its clean lines and chic simplicity, the shift dress is real wardrobe hero. Understated shapes in neutral tones are your essentials for minimal chic, as pencil shapes channel a perfect desk to dinner look and feature prominently across our covetable collection of dresses. The style has developed into a series of well â€œTAILORED DRESSESâ€ with a strong personality, extremely pleasant to wear and able to communicate a great sense of fluidity because of the lightness of the fabrics. There are 100% pure cottons and lines with precious blends like silk declined in a wide range of colours form granite pinks to crystal blue with staple monochromes. \r\nThe collection consists of garments designed to be worn in a classic way that is unconventional at the same time, and is conceived to offer a complete look that includes: a top and pencil or A-line or flare skirt bottoms as a single piece ensemble in traditional Indian weaves.\r\nGARLIC n ONION â€“ represents ther products. The earthen, natural flavours of garlic and onion symbolize our insistence on natural fibers â€“ cotton, silk and jute. Onions and garlic are also apt metaphors for the layers of fabric in sarees and suits.\r\nTranscending time is our design philosophy. The subtle, the sophisticated, the classic never goes out of style. Each of our designs is unique, deeply felt and ageless - like a family heirloom cherished by generations\r\n Just Jewels, Kolkata brings a collection of 92.5% Silver Swarovski Jewellery, termed as Resort-wear. When destination weddings came into fashion and carrying real jewellery out of town became a risk. One has to have an eye of precision to be able to make out its truth. They are easily passable as REAL.The pieces have been intricately handcrafted with pure silver, original Swarovski and semi precious stones by goldsmiths of the Real world. The main collections comprise of solitaires, earrings, hoofs, necklaces, bangles and bracelets, rings, pendants and full necklace sets.\r\nSunflower jewellery Mumbai, is todays one of the most exclusive and fast growing brands in Indian jewellery industry. Semi Precious Setting Silver Jewellery, Diamond studded (C Z stone) white and colour stones / Aesthetic kundan (jadaoo), Ehnique Antique, MeenaKARI, Antique Silver, Victorian Jewellery, Bridal wear set, party wear Set, Earrings, and  Kadas.  \r\nBoondh, Kolkata with designer hand crafted hair accessories and fusion jewellery \r\nHaute DÃ©cor with their new range of home dÃ©cor specializing in export quality cottn bed, bath and kitchen linen.Handbags and accessories from Bottomline and Adaa . Accessories that imbibe traditional crafts with handcrafted techniques and superior quality of materials.This completes the range for Vimonishaâ€™s exhibition at Hyatt Regency on 17th and 18th December 2013. Luscious skin treatment hampers from international cosmetic and skin treatment giant Shiseido and Schwarzkoph Professional too. Also vouchers to be won from Studio Profile Unisex Salon and Spa. Look out for a special promotion at the venue by Vogue too. Fashion enthusiasts can avail of special subscription offers on Vogue magazine at the exhibit', '2013-12-17 16:30:00', '2013-12-19 01:30:00', 'events/731854566843422.jpg', '731854566843422'),
(14, 'The 75th vimonisha exhibition and sale', 'Vimonisha Exhibitions celebrates its platinum 75th show with a Two-day celebration of fashion wear to indulge in. Refresh your wardrobe this Raksha Bandhan and Eid season with a confluence of over 50popular designers of PrÃªt wear, Indian wear, Jewellery, Kidswear accessories and home dÃ©cor from all over the country.', '2013-08-07 15:30:00', '2013-08-09 00:30:00', 'events/542961382436330.jpg', '542961382436330'),
(15, 'Vimonisha Private Collection', 'Designerwear, couture,and pret, jewellery and home decor products and more', '2012-07-18 15:30:00', '2012-07-20 00:30:00', 'events/default.jpg', '379213582128506');

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE IF NOT EXISTS `photos` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(10000) NOT NULL,
  `source` varchar(1000) NOT NULL,
  `createdtime` datetime DEFAULT NULL,
  `albumid` varchar(100) NOT NULL,
  `uid` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=323 ;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `name`, `source`, `createdtime`, `albumid`, `uid`) VALUES
(286, 'Congratulating all our winners for the contest of the previous event!', 'albums/178838325568799/1365121020273851.jpg', '2017-08-10 10:56:00', '178838325568799', '1365121020273851'),
(287, 'The Times of India - E PAPER - 5.8.2017 \nVimonisha Exhibition & Events', 'albums/178838325568799/1364694450316508.jpg', '2017-08-09 23:08:00', '178838325568799', '1364694450316508'),
(288, 'Wishing all our viewers, family and friends a very happy raksha bandhan!! - Team Vimonisha', 'albums/178838325568799/1362310493888237.jpg', '2017-08-07 11:38:00', '178838325568799', '1362310493888237'),
(289, '', 'albums/178838325568799/1358635984255688.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635984255688'),
(290, '', 'albums/178838325568799/1358635737589046.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635737589046'),
(291, '', 'albums/178838325568799/1358635734255713.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635734255713'),
(292, '', 'albums/178838325568799/1358635577589062.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635577589062'),
(293, '', 'albums/178838325568799/1358635574255729.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635574255729'),
(294, '', 'albums/178838325568799/1358635400922413.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635400922413'),
(295, '', 'albums/178838325568799/1358635394255747.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635394255747'),
(296, '', 'albums/178838325568799/1358635147589105.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635147589105'),
(297, '', 'albums/178838325568799/1358635127589107.jpg', '2017-08-03 19:22:00', '178838325568799', '1358635127589107'),
(298, 'Monisha Gidwani, the CEO of Vimonisha Exhibitions looking stunning at the Vimonisha Festive & Wedding Designer Show in her electrifying blue twisted drape dress by Naina Seth.\nVenue - Hyatt Regency, Chennai.', 'albums/178838325568799/1358630144256272.jpg', '2017-08-03 19:19:00', '178838325568799', '1358630144256272'),
(299, 'And Today is the big day! \nVimonisha Festive & Wedding Designer Show is today!', 'albums/178838325568799/1355643644554922.jpg', '2017-07-31 11:12:00', '178838325568799', '1355643644554922'),
(300, '1 day to go for the biggest designer show in Chennai.\n#VimonishaExhibitions #Chennai #DesignerExhibition', 'albums/178838325568799/1355061241279829.jpg', '2017-07-30 18:47:00', '178838325568799', '1355061241279829'),
(301, 'After the response of the prior contest we have announced another - \nFriendship Day Contest.\n\nGet a chance to win two of these goodies for your friend and you. Tag your \n\nFollow these accounts-\nFireflies, Patny Jewels, The Creative Hub\nTag 2 of your friends who you wanna share these goodies with this friendship day!\nBoth your friends must also follow these account.s.\nWinners to be announced on 1st August\n\n#Vimonisha #Exhibitions #Chennai #ContestAlert #FriendshipDay', 'albums/178838325568799/1353199324799354.jpg', '2017-07-28 15:01:00', '178838325568799', '1353199324799354'),
(302, 'Vimonisha Festive & Wedding Designer Show is now only 3 days away!\n\n#Vimonisha #Exhibition #Chennai #FestiveEdition #3daystogo', 'albums/178838325568799/1353102074809079.jpg', '2017-07-28 12:23:00', '178838325568799', '1353102074809079'),
(303, 'We are very happy to announce our media partner for this event RITZ Magazine.\n#VimonishaExhibitions #RitzMagazine #Media #Chennai', 'albums/178838325568799/1353101658142454.jpg', '2017-07-28 12:00:00', '178838325568799', '1353101658142454'),
(304, '', 'albums/178838325568799/1352138478238772.jpg', '2017-07-27 12:38:00', '178838325568799', '1352138478238772'),
(305, '', 'albums/178838325568799/1352136148239005.jpg', '2017-07-27 12:38:00', '178838325568799', '1352136148239005'),
(306, '', 'albums/178838325568799/1352136091572344.jpg', '2017-07-27 12:38:00', '178838325568799', '1352136091572344'),
(307, '', 'albums/178838325568799/1352135114905775.jpg', '2017-07-27 12:34:00', '178838325568799', '1352135114905775'),
(308, '', 'albums/178838325568799/1352135068239113.jpg', '2017-07-27 12:34:00', '178838325568799', '1352135068239113'),
(309, '', 'albums/178838325568799/1352135064905780.jpg', '2017-07-27 12:34:00', '178838325568799', '1352135064905780'),
(310, '', 'albums/178838325568799/1352135054905781.jpg', '2017-07-27 12:34:00', '178838325568799', '1352135054905781'),
(311, '', 'albums/178838325568799/1352133771572576.jpg', '2017-07-27 12:31:00', '178838325568799', '1352133771572576'),
(312, '', 'albums/178838325568799/1352133721572581.jpg', '2017-07-27 12:31:00', '178838325568799', '1352133721572581'),
(313, '', 'albums/178838325568799/1352133718239248.jpg', '2017-07-27 12:31:00', '178838325568799', '1352133718239248'),
(314, '', 'albums/178838325568799/1352133714905915.jpg', '2017-07-27 12:31:00', '178838325568799', '1352133714905915'),
(315, 'It had to be Shopping Therapy!\n#Savethedate #Vimonisha #Chennai #ComingSoon', 'albums/178838325568799/1333676413418312.jpg', '2017-07-10 18:43:00', '178838325568799', '1333676413418312'),
(316, '', 'albums/178838325568799/1333432990109321.jpg', '2017-07-10 13:24:00', '178838325568799', '1333432990109321'),
(317, '', 'albums/178838325568799/1333432976775989.jpg', '2017-07-10 13:24:00', '178838325568799', '1333432976775989'),
(318, '', 'albums/178838325568799/1333432970109323.jpg', '2017-07-10 13:24:00', '178838325568799', '1333432970109323'),
(319, '', 'albums/178838325568799/1333432893442664.jpg', '2017-07-10 13:24:00', '178838325568799', '1333432893442664'),
(320, '', 'albums/178838325568799/1333432890109331.jpg', '2017-07-10 13:24:00', '178838325568799', '1333432890109331'),
(321, '', 'albums/178838325568799/1333432883442665.jpg', '2017-07-10 13:24:00', '178838325568799', '1333432883442665'),
(322, 'Last few stalls left! \nVimonisha Festive & Wedding Designer Show', 'albums/178838325568799/1309368112515809.jpg', '2017-06-17 12:23:00', '178838325568799', '1309368112515809');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `fullpicture` varchar(1000) NOT NULL,
  `uid` varchar(1000) NOT NULL,
  `createdtime` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `name`, `description`, `fullpicture`, `uid`, `createdtime`) VALUES
(29, 'Timeline Photos', '', 'posts/175166319269333_1391148584337761.jpg', '175166319269333_1391148584337761', '2017-09-06 11:38:00'),
(30, 'Timeline Photos', '', 'posts/175166319269333_1391148584337761.jpg', '175166319269333_1391148584337761', '2017-09-06 11:38:00'),
(31, 'Timeline Photos', '', 'posts/175166319269333_1391148584337761.jpg', '175166319269333_1391148584337761', '2017-09-06 11:38:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `id`) VALUES
('kishore', 'admin', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
