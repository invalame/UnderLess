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
    { name: "turrobaby", monthly_listeners: 505169, img: "img/img_artista/turrobaby.png" },
    { name: "Little Boogie", monthly_listeners: 269709, img: "img/img_artista/littleboogie.png" },
    { name: "Stiffy", monthly_listeners: 307888, img: "img/img_artista/stiffy.png" },
    { name: "AgusFortnite2008", monthly_listeners: 240471, img: "img/img_artista/agusfortnite2008.png" },
    { name: "Frozouda", monthly_listeners: 228098, img: "img/img_artista/frozouda.png" },
    { name: "cero*", monthly_listeners: 185201, img: "img/img_artista/cero.png" },
    { name: "Knak", monthly_listeners: 468193, img: "img/img_artista/knak.png" },
    { name: "pabloxo", monthly_listeners: 72252, img: "img/img_artista/pabloxo.png" },
    { name: "SixUp", monthly_listeners: 41424, img: "img/img_artista/sixup.png" },
    { name: "tuw4", monthly_listeners: 79141, img: "img/img_artista/tuw4.png" },
    { name: "shako", monthly_listeners: 120555, img: "img/img_artista/shako.png" },
    { name: "Jugo!", monthly_listeners: 207687, img: "img/img_artista/jugo.png" },
    { name: "Blagh", monthly_listeners: 84473, img: "img/img_artista/blagh.png" },
    { name: "magnesio", monthly_listeners: 23188, img: "img/img_artista/magnesio.png" },
    { name: "Clúster", monthly_listeners: 400114, img: "img/img_artista/cluster.png" },
    { name: "Cosmic Kid", monthly_listeners: 570154, img: "img/img_artista/cosmickid.png" },
    { name: "Ze pequeña", monthly_listeners: 13902, img: "img/img_artista/zepequena.png" },
    { name: "laura sad", monthly_listeners: 33338, img: "img/img_artista/laurasad.png" },
    { name: "Kerchak", monthly_listeners: 18903, img: "img/img_artista/kerchak.png" },
    { name: "enzocerobulto", monthly_listeners: 130997, img: "img/img_artista/enzocerobulto.png" },
    { name: "Dagger", monthly_listeners: 26126, img: "img/img_artista/dagger.png" },
    { name: "isma", monthly_listeners: 17984, img: "img/img_artista/isma.png" },
    { name: "Doly flackko", monthly_listeners: 207635, img: "img/img_artista/dolyflackko.png" },
    { name: "pa2k", monthly_listeners: 80568, img: "img/img_artista/pa2k.png" },
    { name: "143leti", monthly_listeners: 40691, img: "img/img_artista/143leti.png" },
    { name: "elaiyah", monthly_listeners: 69618, img: "img/img_artista/elaiyah.png" },
    { name: "Choosey", monthly_listeners: 57552, img: "img/img_artista/choosey.png" },
    { name: "White!", monthly_listeners: 3930, img: "img/img_artista/white.png" },
    { name: "pankky", monthly_listeners: 54045, img: "img/img_artista/pankky.png" },
    { name: "vahel", monthly_listeners: 10854, img: "img/img_artista/vahel.png" },
    { name: "jovenalien", monthly_listeners: 3476, img: "img/img_artista/jovenalien.png" },
    { name: "Hellolola", monthly_listeners: 128421, img: "img/img_artista/hellolola.png" },
    { name: "2uu!", monthly_listeners: 82735, img: "img/img_artista/2uu.png" },
    { name: "bbtrickz", monthly_listeners: 2646718, img: "img/img_artista/bbtrickz.png" },
    { name: "Rojuu", monthly_listeners: 846565, img: "img/img_artista/rojuu.png" },
    { name: "underaiki", monthly_listeners: 128804, img: "img/img_artista/underaiki.png" },
    { name: "Hwii", monthly_listeners: 38997, img: "img/img_artista/hwii.png" },
    { name: "cybernene", monthly_listeners: 218452, img: "img/img_artista/cybernene.png" },
    { name: "Red Shine", monthly_listeners: 11689, img: "img/img_artista/redshine.png" },
    { name: "Matiasenchufe", monthly_listeners: 16708, img: "img/img_artista/matiasenchufe.png" },
    { name: "Playboi Carti", monthly_listeners: 47823637, img: "img/img_artista/playboicarti.png" },
    { name: "salas flaco", monthly_listeners: 102859, img: "img/img_artista/salasflaco.png" },
    { name: "cowmelek", monthly_listeners: 28369, img: "img/img_artista/cowmelek.png" },
    { name: "huntr", monthly_listeners: 50762, img: "img/img_artista/huntr.png" },
    { name: "Nachotheplug", monthly_listeners: 18930, img: "img/img_artista/nachotheplug.png" },
    { name: "Ramma", monthly_listeners: 874840, img: "img/img_artista/ramma.png" },
    { name: "Hepa", monthly_listeners: 21849, img: "img/img_artista/hepa.png" },
    { name: "agusdelusion", monthly_listeners: 2901, img: "img/img_artista/agusdelusion.png" },
    { name: "Agush", monthly_listeners: 26352, img: "img/img_artista/agush.png" },
    { name: "bic", monthly_listeners: 35661, img: "img/img_artista/bic.png" },
    { name: "nykoo0", monthly_listeners: 11817, img: "img/img_artista/nykoo0.png" },
    { name: "Francis Jeremy", monthly_listeners: 7201, img: "img/img_artista/francisjeremy.png" },
    { name: "Banatroll", monthly_listeners: 2180, img: "img/img_artista/banatroll.png" },
    { name: "Saramalacara", monthly_listeners: 634738, img: "img/img_artista/saramalacara.png" },
    { name: "PanchitoLeFleur", monthly_listeners: 15816, img: "img/img_artista/panchitolefleur.png" },
    { name: "Joshu joshu", monthly_listeners: 38977, img: "img/img_artista/joshujoshu.png" },
];
