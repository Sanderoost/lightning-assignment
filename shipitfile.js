const os = require('os');

// Je debnummer en projectnaam (uit de Node.js selector) vul je hier in
var ACCOUNT = `deb142502`; 
var PROJECT = `Lightning-Project`; 
var DOMAIN = `sander-node.nl`;

// Bepaal de lokale temp directory, afhankelijk van het OS
var LOCAL_TEMP = os.tmpdir();
// De remote home
var REMOTE_BASE_DIR = `/home/${ACCOUNT}`; 

// Dit script maakt een nieuwe map `releases/` aan, waarin de geuploadde releases terechtkomen
var REMOTE_RELEASES_DIR = `${REMOTE_BASE_DIR}/releases`; 
// `current/` wordt een symlink naar de actuele release
var REMOTE_CURRENT_RELEASE_DIR = `${REMOTE_BASE_DIR}/current`; 
// De NPM uit de nodevenv van de Node.js selector
var REMOTE_NPM = `${REMOTE_BASE_DIR}/nodevenv/${PROJECT}/12/bin/npm`; 
var release = release_dir = archive = local_archive = remote_archive = '';

module.exports = shipit => {
  //De basisconfiguratie, naar welk domein willen we deployen en met welke inloggegevens
  shipit.initConfig({
    hostingserver: {
      servers: `${ACCOUNT}@${DOMAIN}`,
    },
  })
  
  shipit.task(`default`, async () => {
    // De default handler wordt als eerste aangeroepen en activeert de rest van de tasks synchroon
    shipit.start(['determine_version_data', 'archive_release', 'upload_release', 'extract_release', 
       'install_dependencies', 'symlink_release', 'restart_application', 'clean_release_archives']);
  })

  shipit.blTask(`archive_release`, async () => {
    // Exporteer met git het project naar een .tar.gz archief in de lokale temp directory
    await shipit.local(`git archive --format=tar.gz HEAD -o ${local_archive}`);
  })

  shipit.blTask(`upload_release`, async () => {
    // Upload het archief naar de remote temp directory
    await shipit.copyToRemote(local_archive, remote_archive);
  })

  shipit.blTask(`extract_release`, async () => {
    // Maak de `releases` map aan indien deze nog niet bestaat
    await shipit.remote(`mkdir -p ${REMOTE_RELEASES_DIR}`);
    // Maak een nieuwe map aan voor de release
    await shipit.remote(`mkdir -p ${release_dir}`);
    // Pak het geuploadde archief uit in de nieuwe releasemap
    await shipit.remote(`tar -xaf ${remote_archive} -C ${release_dir}`);
  })

  shipit.blTask(`install_dependencies`, async () => {
    // Installeer de softwarepakketten op basis van de package.json uit de nieuwe release
    await shipit.remote(`${REMOTE_NPM} --prefix ${release_dir} install`);
  })

  shipit.blTask(`symlink_release`, async () => {
    // Laat de symlink `current/` doorverwijzen naar de zojuist geplaatste release
    await shipit.remote(`ln -fns ${release_dir} ${REMOTE_CURRENT_RELEASE_DIR}`);
  })

  shipit.blTask(`restart_application`, async () => {
    // Herstart de applicatie zoals aanbevolen met een touch op restart.txt
    await shipit.remote(`mkdir -p ${REMOTE_BASE_DIR}/${PROJECT}/tmp`);
    await shipit.remote(`touch ${REMOTE_BASE_DIR}/${PROJECT}/tmp/restart.txt`);
  })

  shipit.blTask(`clean_release_archives`, async () => {
    // Ruim de archiefbestanden op uit de temp directories na afloop van een release
    await shipit.local(`rm ${local_archive}`);
    await shipit.remote(`rm ${remote_archive}`);
  })
  
  shipit.blTask(`determine_version_data`, async () => {
    await shipit.local(`git describe --tags HEAD`)
        .then(({ stdout }) => {
          // Bepaal de releaseversie op basis van de Git tag (deze wordt gezet met npm version patch)
          release = stdout.trim().replace(`/`, `-`);
          release_dir = `${REMOTE_RELEASES_DIR}/${release}`;
          // De naam van het archief waarin de release wordt ingepakt
          archive = `${PROJECT}_${release}.tar.gz`;
          local_archive = `${LOCAL_TEMP}/${archive}`;
          remote_archive = `/tmp/${archive}`;
        })
  })
}