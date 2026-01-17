/**
 * UnderLess Artists Data for "Under or Higher" Game Mode
 * 
 * Each artist object must have:
 *   - name: string (display name)
 *   - monthly_listeners: integer (Spotify monthly listeners, no formatting)
 *   - img: string (relative path from UnderLess/, e.g. "img/img_artista/artist.png")
 * 
 * Images should be placed in: UnderLess/img/img_artista/
 * Recommended image size: 300x300 or 400x400 pixels (square)
 */

const UNDERLESS_ARTISTS = [
    { name: "Zell", monthly_listeners: 585554, img: "img/img_artista/zell.png" },
    { name: "afkGOAT", monthly_listeners: 14269, img: "img/img_artista/afkgoat.png" },
    { name: "lolo", monthly_listeners: 125645, img: "img/img_artista/lolo.png" },
    { name: "turrobaby", monthly_listeners: 596249, img: "img/img_artista/turrobaby.png" },
    { name: "Little Boogie", monthly_listeners: 290411, img: "img/img_artista/littleboogie.png" },
    { name: "Stiffy", monthly_listeners: 307888, img: "img/img_artista/stiffy.png" },
    { name: "AgusFortnite2008", monthly_listeners: 240001, img: "img/img_artista/agusfortnite2008.png" },
    { name: "Frozouda", monthly_listeners: 225789, img: "img/img_artista/frozouda.png" },
    { name: "cero*", monthly_listeners: 167730, img: "img/img_artista/cero.png" },
    { name: "Knak", monthly_listeners: 435457, img: "img/img_artista/knak.png" },
    { name: "pabloxo", monthly_listeners: 80421, img: "img/img_artista/pabloxo.png" },
    { name: "SixUp", monthly_listeners: 37464, img: "img/img_artista/sixup.png" },
    { name: "tuw4", monthly_listeners: 78257, img: "img/img_artista/tuw4.png" },
    { name: "shako", monthly_listeners: 119851, img: "img/img_artista/shako.png" },
    { name: "Jugo!", monthly_listeners: 183880, img: "img/img_artista/jugo.png" },
    { name: "Blagh", monthly_listeners: 75301, img: "img/img_artista/blagh.png" },
    { name: "magnesio", monthly_listeners: 22637, img: "img/img_artista/magnesio.png" },
    { name: "Clúster", monthly_listeners: 370334, img: "img/img_artista/cluster.png" },
    { name: "Ze pequeña", monthly_listeners: 13979, img: "img/img_artista/zepequena.png" },
    { name: "laura sad", monthly_listeners: 37985, img: "img/img_artista/laurasad.png" },
    { name: "Kerchak", monthly_listeners: 18903, img: "img/img_artista/kerchak.png" },
    { name: "enzocerobulto", monthly_listeners: 110584, img: "img/img_artista/enzocerobulto.png" },
    { name: "Dagger", monthly_listeners: 24208, img: "img/img_artista/dagger.png" },
    { name: "isma", monthly_listeners: 18826, img: "img/img_artista/isma.png" },
    { name: "muerejoven", monthly_listeners: 187403, img: "img/img_artista/muerejoven.png" },
    { name: "Doly flackko", monthly_listeners: 198960, img: "img/img_artista/dolyflackko.png" },
    { name: "pa2k", monthly_listeners: 80475, img: "img/img_artista/pa2k.png" },
    { name: "143leti", monthly_listeners: 33612, img: "img/img_artista/143leti.png" },
    { name: "elaiyah", monthly_listeners: 70876, img: "img/img_artista/elaiyah.png" },
    { name: "Choosey", monthly_listeners: 49645, img: "img/img_artista/choosey.png" },
    { name: "White!", monthly_listeners: 3625, img: "img/img_artista/white.png" },
    { name: "pankky", monthly_listeners: 54511, img: "img/img_artista/pankky.png" },
    { name: "vahel", monthly_listeners: 11350, img: "img/img_artista/vahel.png" },
    { name: "jovenalien", monthly_listeners: 3569, img: "img/img_artista/jovenalien.png" },
    { name: "Hellolola", monthly_listeners: 113702, img: "img/img_artista/hellolola.png" },
    { name: "2uu!", monthly_listeners: 67519, img: "img/img_artista/2uu.png" },
    { name: "bbtrickz", monthly_listeners: 2646718, img: "img/img_artista/bbtrickz.png" },
    { name: "Rojuu", monthly_listeners: 846565, img: "img/img_artista/rojuu.png" },
    { name: "underaiki", monthly_listeners: 145172, img: "img/img_artista/underaiki.png" },
    { name: "Hwii", monthly_listeners: 32096, img: "img/img_artista/hwii.png" },
    { name: "cybernene", monthly_listeners: 234092, img: "img/img_artista/cybernene.png" },
    { name: "Red Shine", monthly_listeners: 14830, img: "img/img_artista/redshine.png" },
    { name: "Matiasenchufe", monthly_listeners: 15735, img: "img/img_artista/matiasenchufe.png" },
    { name: "Playboi Carti", monthly_listeners: 47823637, img: "img/img_artista/playboicarti.png" },
    { name: "salas flaco", monthly_listeners: 123151, img: "img/img_artista/salasflaco.png" },
    { name: "cowmelek", monthly_listeners: 28369, img: "img/img_artista/cowmelek.png" },
    { name: "huntr", monthly_listeners: 48283, img: "img/img_artista/huntr.png" },
    { name: "Nachotheplug", monthly_listeners: 17255, img: "img/img_artista/nachotheplug.png" },
    { name: "Ramma", monthly_listeners: 883925, img: "img/img_artista/ramma.png" },
    { name: "Hepa", monthly_listeners: 22160, img: "img/img_artista/hepa.png" },
    { name: "agusdelusion", monthly_listeners: 2862, img: "img/img_artista/agusdelusion.png" },
    { name: "Agush", monthly_listeners: 24695, img: "img/img_artista/agush.png" },
    { name: "bic", monthly_listeners: 32922, img: "img/img_artista/bic.png" },
    { name: "nykoo0", monthly_listeners: 10196, img: "img/img_artista/nykoo0.png" },
    { name: "Francis Jeremy", monthly_listeners: 7201, img: "img/img_artista/francisjeremy.png" },
    { name: "Banatroll", monthly_listeners: 2180, img: "img/img_artista/banatroll.png" },
    { name: "Saramalacara", monthly_listeners: 634738, img: "img/img_artista/saramalacara.png" },
    { name: "PanchitoLeFleur", monthly_listeners: 17538, img: "img/img_artista/panchitolefleur.png" },
    { name: "Joshu joshu", monthly_listeners: 31845, img: "img/img_artista/joshujoshu.png" },
];
