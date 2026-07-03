import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import ResumeIntroModal from "../components/resume/ResumeIntroModal";
import ResumeSkillMeterModal from "../components/resume/ResumeSkillMeterModal";
import ResumeSkillGroupModal from "../components/resume/ResumeSkillGroupModal";
import ResumeSkillModal from "../components/resume/ResumeSkillModal";
import ResumeWorkExperienceModal from "../components/resume/ResumeWorkExperienceModal";
import ResumeAwardModal from "../components/resume/ResumeAwardModal";
import styles from "../styles/Resume.module.css";
import { useAuth } from "../context/AuthContext";
import AnimatedHero from "../components/home/AnimatedHero";
import {
  createResumeIntro,
  deleteResumeIntro,
  getResumeAwards,
  getResumeIntro,
  getResumeSkillGroups,
  getResumeSkillMeters,
  getResumeWorkExperiences,
  updateResumeIntro,
  createResumeSkillMeter,
  deleteResumeSkillMeter,
  updateResumeSkillMeter,
  createResumeWorkExperience,
  createResumeWorkExperienceBullet,
  deleteResumeWorkExperience,
  deleteResumeWorkExperienceBullet,
  updateResumeWorkExperience,
  updateResumeWorkExperienceBullet,
  createResumeSkillGroup,
  deleteResumeSkillGroup,
  updateResumeSkillGroup,
  createResumeSkill,
  deleteResumeSkill,
  updateResumeSkill,
  createResumeAward,
  deleteResumeAward,
  updateResumeAward,
} from "../services/resumeApi";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

function formatExperienceDate(experience) {
  const startDate = formatDate(experience.start_date);
  const endDate = experience.is_current
    ? "Present"
    : formatDate(experience.end_date);

  if (startDate && endDate) {
    return `${startDate} – ${endDate}`;
  }

  if (startDate) {
    return startDate;
  }

  return "";
}

function normalizeName(value) {
  return value.toLowerCase().replaceAll(" ", "").replaceAll("-", "");
}

function findGroup(skillGroups, possibleNames) {
  return skillGroups.find((group) =>
    possibleNames.some(
      (name) => normalizeName(group.name) === normalizeName(name),
    ),
  );
}

function getGroupIconClass(groupName) {
  const normalizedName = normalizeName(groupName);

  const icons = {
    frontend: "fa-solid fa-tv",
    backend: "fa-solid fa-gears",
    datascience: "fa-solid fa-chart-line",
    tools: "fa-solid fa-code-branch",
    databases: "fa-solid fa-database",
    psychology: "fa-solid fa-brain",
    militaryservice: "fa-solid fa-shield-halved",
    creativetools: "fa-solid fa-palette",
    artcreative: "fa-solid fa-paintbrush",
  };

  return icons[normalizedName] || "fa-solid fa-circle-check";
}

function getTimelineClass(experienceType) {
  const highlightedTypes = [
    "education",
    "data_science",
    "psychology",
    "military",
  ];

  if (!highlightedTypes.includes(experienceType)) {
    return styles.timelineItem;
  }

  const typeClassMap = {
    education: styles.timelineItemEducation,
    data_science: styles.timelineItemDataScience,
    psychology: styles.timelineItemPsychology,
    military: styles.timelineItemMilitary,
  };

  return `${styles.timelineItem} ${typeClassMap[experienceType]}`;
}

function Resume() {
  const { isAdmin } = useAuth();
  const [intro, setIntro] = useState(null);
  const [skillGroups, setSkillGroups] = useState([]);
  const [skillMeters, setSkillMeters] = useState([]);
  const [showSkillMeterModal, setShowSkillMeterModal] = useState(false);
  const [selectedSkillMeter, setSelectedSkillMeter] = useState(null);
  const [isSkillMeterSubmitting, setIsSkillMeterSubmitting] = useState(false);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isIntroSubmitting, setIsIntroSubmitting] = useState(false);
  const [showWorkExperienceModal, setShowWorkExperienceModal] = useState(false);
  const [selectedWorkExperience, setSelectedWorkExperience] = useState(null);
  const [isWorkExperienceSubmitting, setIsWorkExperienceSubmitting] =
    useState(false);
  const [showSkillGroupModal, setShowSkillGroupModal] = useState(false);
  const [selectedSkillGroup, setSelectedSkillGroup] = useState(null);
  const [isSkillGroupSubmitting, setIsSkillGroupSubmitting] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedSkillDefaultGroup, setSelectedSkillDefaultGroup] =
    useState(null);
  const [isSkillSubmitting, setIsSkillSubmitting] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [isAwardSubmitting, setIsAwardSubmitting] = useState(false);

  useEffect(() => {
    async function loadResumeData() {
      setErrorMessage("");

      try {
        const [
          introData,
          skillGroupsData,
          skillMetersData,
          workExperiencesData,
          awardsData,
        ] = await Promise.all([
          getResumeIntro(),
          getResumeSkillGroups(),
          getResumeSkillMeters(),
          getResumeWorkExperiences(),
          getResumeAwards(),
        ]);

        setIntro(introData);
        setSkillGroups(skillGroupsData);
        setSkillMeters(skillMetersData);
        setWorkExperiences(workExperiencesData);
        setAwards(awardsData);
      } catch (error) {
        setErrorMessage(error.message || "Could not load resume content.");
      } finally {
        setIsLoading(false);
      }
    }

    loadResumeData();
  }, []);

  const frontendGroup = useMemo(
    () => findGroup(skillGroups, ["Frontend", "Front End"]),
    [skillGroups],
  );

  const backendGroup = useMemo(
    () => findGroup(skillGroups, ["Backend", "Back End"]),
    [skillGroups],
  );

  const featureGroups = useMemo(
    () => [frontendGroup, backendGroup].filter(Boolean),
    [frontendGroup, backendGroup],
  );

  const toolkitGroups = useMemo(() => {
    const featureIds = featureGroups.map((group) => group.id);

    return skillGroups.filter((group) => !featureIds.includes(group.id));
  }, [skillGroups, featureGroups]);

  const mainAward = awards[0] || null;

  async function handleSaveIntro(introData) {
    setIsIntroSubmitting(true);
    setErrorMessage("");

    try {
      const savedIntro = intro
        ? await updateResumeIntro(intro.id, introData)
        : await createResumeIntro(introData);

      setIntro(savedIntro);
      setShowIntroModal(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save resume intro.");
    } finally {
      setIsIntroSubmitting(false);
    }
  }

  async function handleDeleteIntro() {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete the Resume intro?",
    );

    if (!shouldDelete || !intro) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteResumeIntro(intro.id);
      setIntro(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not delete resume intro.");
    }
  }

  function handleOpenCreateSkillMeter() {
    setSelectedSkillMeter(null);
    setShowSkillMeterModal(true);
  }

  function handleOpenEditSkillMeter(skillMeter) {
    setSelectedSkillMeter(skillMeter);
    setShowSkillMeterModal(true);
  }

  async function handleSaveSkillMeter(skillMeterData) {
    setIsSkillMeterSubmitting(true);
    setErrorMessage("");

    try {
      const savedSkillMeter = selectedSkillMeter
        ? await updateResumeSkillMeter(selectedSkillMeter.id, skillMeterData)
        : await createResumeSkillMeter(skillMeterData);

      setSkillMeters((currentSkillMeters) => {
        const updatedSkillMeters = selectedSkillMeter
          ? currentSkillMeters.map((skillMeter) =>
              skillMeter.id === savedSkillMeter.id
                ? savedSkillMeter
                : skillMeter,
            )
          : [...currentSkillMeters, savedSkillMeter];

        return [...updatedSkillMeters].sort(
          (firstSkillMeter, secondSkillMeter) =>
            firstSkillMeter.display_order - secondSkillMeter.display_order ||
            firstSkillMeter.name.localeCompare(secondSkillMeter.name),
        );
      });

      setShowSkillMeterModal(false);
      setSelectedSkillMeter(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not save skill meter.");
    } finally {
      setIsSkillMeterSubmitting(false);
    }
  }

  async function handleDeleteSkillMeter(skillMeter) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${skillMeter.name}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteResumeSkillMeter(skillMeter.id);

      setSkillMeters((currentSkillMeters) =>
        currentSkillMeters.filter(
          (currentSkillMeter) => currentSkillMeter.id !== skillMeter.id,
        ),
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not delete skill meter.");
    }
  }

  function handleOpenCreateWorkExperience() {
    setSelectedWorkExperience(null);
    setShowWorkExperienceModal(true);
  }

  function handleOpenEditWorkExperience(experience) {
    setSelectedWorkExperience(experience);
    setShowWorkExperienceModal(true);
  }

  async function syncWorkExperienceBullets(experienceId, bullets) {
    const bulletRequests = bullets.map((bullet) => {
      if (bullet.id && bullet.shouldDelete) {
        return deleteResumeWorkExperienceBullet(bullet.id);
      }

      if (bullet.shouldDelete || !bullet.text.trim()) {
        return Promise.resolve();
      }

      const bulletData = {
        experience: experienceId,
        text: bullet.text.trim(),
        display_order: bullet.display_order,
      };

      if (bullet.id) {
        return updateResumeWorkExperienceBullet(bullet.id, bulletData);
      }

      return createResumeWorkExperienceBullet(bulletData);
    });

    await Promise.all(bulletRequests);
  }

  async function handleSaveWorkExperience({ experienceData, bullets }) {
    setIsWorkExperienceSubmitting(true);
    setErrorMessage("");

    try {
      const savedExperience = selectedWorkExperience
        ? await updateResumeWorkExperience(
            selectedWorkExperience.id,
            experienceData,
          )
        : await createResumeWorkExperience(experienceData);

      await syncWorkExperienceBullets(savedExperience.id, bullets);

      const refreshedExperiences = await getResumeWorkExperiences();
      setWorkExperiences(refreshedExperiences);

      setShowWorkExperienceModal(false);
      setSelectedWorkExperience(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not save work experience.");
    } finally {
      setIsWorkExperienceSubmitting(false);
    }
  }

  async function handleDeleteWorkExperience(experience) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${experience.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteResumeWorkExperience(experience.id);

      setWorkExperiences((currentExperiences) =>
        currentExperiences.filter(
          (currentExperience) => currentExperience.id !== experience.id,
        ),
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not delete work experience.");
    }
  }

  function sortSkillGroups(groups) {
    return [...groups].sort(
      (firstGroup, secondGroup) =>
        firstGroup.display_order - secondGroup.display_order ||
        firstGroup.name.localeCompare(secondGroup.name),
    );
  }

  function handleOpenCreateSkillGroup() {
    setSelectedSkillGroup(null);
    setShowSkillGroupModal(true);
  }

  function handleOpenEditSkillGroup(skillGroup) {
    setSelectedSkillGroup(skillGroup);
    setShowSkillGroupModal(true);
  }

  async function handleSaveSkillGroup(skillGroupData) {
    setIsSkillGroupSubmitting(true);
    setErrorMessage("");

    try {
      const savedSkillGroup = selectedSkillGroup
        ? await updateResumeSkillGroup(selectedSkillGroup.id, skillGroupData)
        : await createResumeSkillGroup(skillGroupData);

      setSkillGroups((currentSkillGroups) => {
        const updatedSkillGroups = selectedSkillGroup
          ? currentSkillGroups.map((group) =>
              group.id === savedSkillGroup.id ? savedSkillGroup : group,
            )
          : [...currentSkillGroups, savedSkillGroup];

        return sortSkillGroups(updatedSkillGroups);
      });

      setShowSkillGroupModal(false);
      setSelectedSkillGroup(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not save skill group.");
    } finally {
      setIsSkillGroupSubmitting(false);
    }
  }

  async function handleDeleteSkillGroup(skillGroup) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${skillGroup.name}"? This will also delete the skills inside this group.`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteResumeSkillGroup(skillGroup.id);

      setSkillGroups((currentSkillGroups) =>
        currentSkillGroups.filter((group) => group.id !== skillGroup.id),
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not delete skill group.");
    }
  }

  function handleOpenCreateSkill(skillGroup) {
    setSelectedSkill(null);
    setSelectedSkillDefaultGroup(skillGroup);
    setShowSkillModal(true);
  }

  function handleOpenEditSkill(skill, skillGroup) {
    setSelectedSkill(skill);
    setSelectedSkillDefaultGroup(skillGroup);
    setShowSkillModal(true);
  }

  async function handleSaveSkill(skillData) {
    setIsSkillSubmitting(true);
    setErrorMessage("");

    try {
      if (selectedSkill) {
        await updateResumeSkill(selectedSkill.id, skillData);
      } else {
        await createResumeSkill(skillData);
      }

      const refreshedSkillGroups = await getResumeSkillGroups();
      setSkillGroups(refreshedSkillGroups);

      setShowSkillModal(false);
      setSelectedSkill(null);
      setSelectedSkillDefaultGroup(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not save skill.");
    } finally {
      setIsSkillSubmitting(false);
    }
  }

  async function handleDeleteSkill(skill) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteResumeSkill(skill.id);

      const refreshedSkillGroups = await getResumeSkillGroups();
      setSkillGroups(refreshedSkillGroups);
    } catch (error) {
      setErrorMessage(error.message || "Could not delete skill.");
    }
  }

  function sortAwards(awardItems) {
    return [...awardItems].sort(
      (firstAward, secondAward) =>
        firstAward.display_order - secondAward.display_order ||
        firstAward.title.localeCompare(secondAward.title),
    );
  }

  function handleOpenCreateAward() {
    setSelectedAward(null);
    setShowAwardModal(true);
  }

  function handleOpenEditAward(award) {
    setSelectedAward(award);
    setShowAwardModal(true);
  }

  async function handleSaveAward(awardData) {
    setIsAwardSubmitting(true);
    setErrorMessage("");

    try {
      const savedAward = selectedAward
        ? await updateResumeAward(selectedAward.id, awardData)
        : await createResumeAward(awardData);

      setAwards((currentAwards) => {
        const updatedAwards = selectedAward
          ? currentAwards.map((award) =>
              award.id === savedAward.id ? savedAward : award,
            )
          : [...currentAwards, savedAward];

        return sortAwards(updatedAwards);
      });

      setShowAwardModal(false);
      setSelectedAward(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not save award.");
    } finally {
      setIsAwardSubmitting(false);
    }
  }

  async function handleDeleteAward(award) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${award.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteResumeAward(award.id);

      setAwards((currentAwards) =>
        currentAwards.filter((currentAward) => currentAward.id !== award.id),
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not delete award.");
    }
  }

  return (
    <>
      <AnimatedHero
        canvasText="RESUME"
        topLabel="Skills · Experience · Awards"
        theme="purple"
      />

      <section className="page-section">
        <Container>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading resume...</span>
            </div>
          )}

          {!isLoading && (
            <>
              {intro ? (
                <div className={styles.resumeIntro}>
                  <p className="card-label">Resume</p>

                  <h1 className={styles.resumeTitle}>{intro.title}</h1>

                  {intro.subtitle && (
                    <h2 className={styles.resumeSubtitle}>{intro.subtitle}</h2>
                  )}

                  {intro.summary && (
                    <p className={styles.resumeSummary}>{intro.summary}</p>
                  )}

                  {isAdmin && (
                    <div className={styles.adminActionRow}>
                      <Button
                        type="button"
                        variant="outline-light"
                        size="sm"
                        className={styles.adminMiniButton}
                        onClick={() => setShowIntroModal(true)}
                      >
                        <i className="fa-solid fa-pen-to-square" />
                        Edit intro
                      </Button>

                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        className={styles.adminMiniButton}
                        onClick={handleDeleteIntro}
                      >
                        <i className="fa-solid fa-trash" />
                        Delete intro
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                isAdmin && (
                  <div className={styles.adminToolbar}>
                    <Button
                      type="button"
                      variant="outline-light"
                      size="sm"
                      className={styles.adminMiniButton}
                      onClick={() => setShowIntroModal(true)}
                    >
                      <i className="fa-solid fa-plus" />
                      Create Resume intro
                    </Button>
                  </div>
                )
              )}

              <div className={styles.resumeShell}>
                <div className={styles.skillsPanel}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionKicker}>Technical profile</p>
                      <h2 className={styles.sectionTitle}>My Skills</h2>
                    </div>
                  </div>

                  <div className={styles.featureGrid}>
                    {featureGroups.map((group) => (
                      <article className={styles.featureCard} key={group.id}>
                        <div className={styles.featureIcon}>
                          <i className={getGroupIconClass(group.name)} />
                        </div>

                        <div>
                          <h3 className={styles.featureTitle}>{group.name}</h3>

                          {group.description && (
                            <p className={styles.featureText}>
                              {group.description}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}

                    {mainAward && (
                      <article className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                          <i className="fa-solid fa-medal" />
                        </div>

                        <div>
                          <h3 className={styles.featureTitle}>Awards</h3>

                          <p className={styles.featureText}>
                            <strong>{mainAward.title}</strong>
                            {mainAward.issuer && ` at ${mainAward.issuer}`}
                            {mainAward.description &&
                              ` — ${mainAward.description}`}
                          </p>
                        </div>
                      </article>
                    )}
                  </div>

                  <div className={styles.progressSection}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <p className={styles.sectionKicker}>Skill meters</p>
                        <h2 className={styles.sectionTitle}>
                          Programming Languages
                        </h2>
                      </div>

                      {isAdmin && (
                        <Button
                          type="button"
                          variant="outline-light"
                          size="sm"
                          className={styles.adminMiniButton}
                          onClick={handleOpenCreateSkillMeter}
                        >
                          <i className="fa-solid fa-plus" />
                          Add meter
                        </Button>
                      )}
                    </div>

                    {skillMeters.length === 0 ? (
                      <div className={styles.emptyState}>
                        No programming meters have been published yet.
                      </div>
                    ) : (
                      <div className={styles.meterGrid}>
                        {skillMeters.map((meter) => (
                          <div className={styles.meterItem} key={meter.id}>
                            <div className={styles.meterCard}>
                              <div className={styles.meterTop}>
                                <span className={styles.meterName}>
                                  {meter.icon_class && (
                                    <i
                                      className={`${styles.meterIcon} ${meter.icon_class}`}
                                    />
                                  )}
                                  {meter.name}
                                </span>

                                <span className={styles.meterPercent}>
                                  {meter.percentage}%
                                </span>
                              </div>

                              <div className={styles.meterTrack}>
                                <div
                                  className={styles.meterFill}
                                  style={{
                                    width: `${meter.percentage}%`,
                                    backgroundColor: meter.color_hex,
                                  }}
                                />
                              </div>
                            </div>

                            {isAdmin && (
                              <div className={styles.meterAdminActions}>
                                <Button
                                  type="button"
                                  variant="outline-light"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() =>
                                    handleOpenEditSkillMeter(meter)
                                  }
                                >
                                  <i className="fa-solid fa-pen-to-square" />
                                  Edit
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline-danger"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() => handleDeleteSkillMeter(meter)}
                                >
                                  <i className="fa-solid fa-trash" />
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.resumeSection}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <p className={styles.sectionKicker}>Toolkit</p>
                        <h2 className={styles.sectionTitle}>
                          Technical Skillset
                        </h2>
                      </div>

                      {isAdmin && (
                        <Button
                          type="button"
                          variant="outline-light"
                          size="sm"
                          className={styles.adminMiniButton}
                          onClick={handleOpenCreateSkillGroup}
                        >
                          <i className="fa-solid fa-plus" />
                          Add group
                        </Button>
                      )}
                    </div>

                    {toolkitGroups.length === 0 ? (
                      <div className={styles.emptyState}>
                        No skill groups have been published yet.
                      </div>
                    ) : (
                      <div className={styles.groupGrid}>
                        {toolkitGroups.map((group) => (
                          <article
                            className={styles.skillGroupCard}
                            key={group.id}
                          >
                            <div className={styles.skillGroupTitleRow}>
                              <div
                                className={styles.skillGroupIcon}
                                style={{ backgroundColor: group.color_hex }}
                              >
                                <i
                                  className={
                                    group.icon_class ||
                                    getGroupIconClass(group.name)
                                  }
                                />
                              </div>

                              <h3 className={styles.skillGroupTitle}>
                                {group.name}
                              </h3>
                            </div>

                            {group.description && (
                              <p className={styles.skillGroupDescription}>
                                {group.description}
                              </p>
                            )}

                            {group.skills.length > 0 ? (
                              <ul className={styles.skillList}>
                                {group.skills.map((skill) => (
                                  <li
                                    className={styles.skillListItem}
                                    key={skill.id}
                                  >
                                    <span className={styles.skillItemText}>
                                      <i
                                        className={
                                          skill.icon_class ||
                                          "fa-solid fa-circle-check"
                                        }
                                        style={{ color: skill.color_hex }}
                                      />
                                      <span>{skill.name}</span>
                                    </span>

                                    {isAdmin && (
                                      <span className={styles.skillItemActions}>
                                        <Button
                                          type="button"
                                          variant="outline-light"
                                          size="sm"
                                          className={styles.adminIconOnlyButton}
                                          onClick={() =>
                                            handleOpenEditSkill(skill, group)
                                          }
                                          title="Edit skill"
                                        >
                                          <i className="fa-solid fa-pen-to-square" />
                                        </Button>

                                        <Button
                                          type="button"
                                          variant="outline-danger"
                                          size="sm"
                                          className={styles.adminIconOnlyButton}
                                          onClick={() =>
                                            handleDeleteSkill(skill)
                                          }
                                          title="Delete skill"
                                        >
                                          <i className="fa-solid fa-trash" />
                                        </Button>
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              isAdmin && (
                                <div className={styles.emptyInlineState}>
                                  No skills yet. Add the first one.
                                </div>
                              )
                            )}

                            {isAdmin && (
                              <div className={styles.adminMiniActions}>
                                <Button
                                  type="button"
                                  variant="outline-success"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() => handleOpenCreateSkill(group)}
                                >
                                  <i className="fa-solid fa-plus" />
                                  Add skill
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline-light"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() =>
                                    handleOpenEditSkillGroup(group)
                                  }
                                >
                                  <i className="fa-solid fa-pen-to-square" />
                                  Edit group
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline-danger"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() => handleDeleteSkillGroup(group)}
                                >
                                  <i className="fa-solid fa-trash" />
                                  Delete group
                                </Button>
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>

                  {(awards.length > 0 || isAdmin) && (
                    <div className={styles.resumeSection}>
                      <div className={styles.sectionHeader}>
                        <div>
                          <p className={styles.sectionKicker}>Recognition</p>
                          <h2 className={styles.sectionTitle}>Awards</h2>
                        </div>
                      </div>

                      {awards.length === 0 ? (
                        <div className={styles.emptyState}>
                          No awards have been published yet.
                        </div>
                      ) : (
                        <div className={styles.awardsGrid}>
                          {awards.map((award) => (
                            <article
                              className={styles.awardCard}
                              key={award.id}
                            >
                              {award.file_type === "image" && award.file_url ? (
                                <img
                                  src={award.file_url}
                                  alt={award.title}
                                  className={styles.awardImage}
                                />
                              ) : (
                                <div className={styles.awardIconBox}>
                                  <i className="fa-solid fa-medal" />
                                </div>
                              )}

                              <div className={styles.awardBody}>
                                <h3 className={styles.awardTitle}>
                                  {award.title}
                                </h3>

                                <div className={styles.awardMeta}>
                                  {award.issuer && <span>{award.issuer}</span>}

                                  {award.award_date && (
                                    <span>
                                      {" "}
                                      · {formatDate(award.award_date)}
                                    </span>
                                  )}
                                </div>

                                {award.description && (
                                  <p className={styles.awardDescription}>
                                    {award.description}
                                  </p>
                                )}

                                {award.file_url && (
                                  <div className={styles.awardActions}>
                                    <Button
                                      href={award.file_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      variant="outline-warning"
                                      size="sm"
                                    >
                                      Open{" "}
                                      {award.file_type === "pdf"
                                        ? "PDF"
                                        : "File"}
                                    </Button>
                                  </div>
                                )}

                                {isAdmin && (
                                  <div className={styles.adminMiniActions}>
                                    <Button
                                      type="button"
                                      variant="outline-light"
                                      size="sm"
                                      className={styles.adminMiniButton}
                                      onClick={() => handleOpenEditAward(award)}
                                    >
                                      <i className="fa-solid fa-pen-to-square" />
                                      Edit award
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="outline-danger"
                                      size="sm"
                                      className={styles.adminMiniButton}
                                      onClick={() => handleDeleteAward(award)}
                                    >
                                      <i className="fa-solid fa-trash" />
                                      Delete award
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <aside className={styles.timelinePanel}>
                  <div className={styles.timelineHeader}>
                    <h2 className={styles.timelineHeading}>Work Experience</h2>

                    {isAdmin && (
                      <Button
                        type="button"
                        variant="outline-light"
                        size="sm"
                        className={styles.adminMiniButton}
                        onClick={handleOpenCreateWorkExperience}
                      >
                        <i className="fa-solid fa-plus" />
                        Add experience
                      </Button>
                    )}
                  </div>

                  {workExperiences.length === 0 ? (
                    <div className={styles.emptyState}>
                      No work experience has been published yet.
                    </div>
                  ) : (
                    <div className={styles.experienceList}>
                      {workExperiences.map((experience) => {
                        const dateLabel = formatExperienceDate(experience);

                        const heading =
                          experience.organization || experience.title;

                        const role = experience.organization
                          ? experience.title
                          : "";

                        return (
                          <article
                            className={getTimelineClass(
                              experience.experience_type,
                            )}
                            data-dates={
                              dateLabel || (isAdmin ? "No dates set" : "")
                            }
                            key={experience.id}
                            style={{
                              "--timeline-accent":
                                experience.color_hex || "#f8fafc",
                            }}
                          >
                            <h3 className={styles.experienceTitle}>
                              {experience.icon_class && (
                                <i
                                  className={`${styles.experienceIcon} ${experience.icon_class}`}
                                />
                              )}
                              {heading}
                            </h3>

                            {role && (
                              <p className={styles.experienceRole}>{role}</p>
                            )}

                            {experience.location && (
                              <p className={styles.experienceLocation}>
                                {experience.location}
                              </p>
                            )}

                            {experience.summary && (
                              <p className={styles.experienceSummary}>
                                {experience.summary}
                              </p>
                            )}

                            {experience.bullets.length > 0 && (
                              <ul className={styles.experienceBullets}>
                                {experience.bullets.map((bullet) => (
                                  <li key={bullet.id}>{bullet.text}</li>
                                ))}
                              </ul>
                            )}

                            <span className={styles.typeBadge}>
                              {experience.experience_type_label}
                            </span>
                            {isAdmin && (
                              <div className={styles.timelineAdminActions}>
                                <Button
                                  type="button"
                                  variant="outline-light"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() =>
                                    handleOpenEditWorkExperience(experience)
                                  }
                                >
                                  <i className="fa-solid fa-pen-to-square" />
                                  Edit
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline-danger"
                                  size="sm"
                                  className={styles.adminMiniButton}
                                  onClick={() =>
                                    handleDeleteWorkExperience(experience)
                                  }
                                >
                                  <i className="fa-solid fa-trash" />
                                  Delete
                                </Button>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </Container>
      </section>

      <ResumeIntroModal
        show={showIntroModal}
        intro={intro}
        onClose={() => setShowIntroModal(false)}
        onSave={handleSaveIntro}
        isSubmitting={isIntroSubmitting}
      />

      <ResumeSkillMeterModal
        show={showSkillMeterModal}
        skillMeter={selectedSkillMeter}
        onClose={() => {
          setShowSkillMeterModal(false);
          setSelectedSkillMeter(null);
        }}
        onSave={handleSaveSkillMeter}
        isSubmitting={isSkillMeterSubmitting}
      />

      <ResumeWorkExperienceModal
        show={showWorkExperienceModal}
        experience={selectedWorkExperience}
        onClose={() => {
          setShowWorkExperienceModal(false);
          setSelectedWorkExperience(null);
        }}
        onSave={handleSaveWorkExperience}
        isSubmitting={isWorkExperienceSubmitting}
      />

      <ResumeSkillGroupModal
        show={showSkillGroupModal}
        skillGroup={selectedSkillGroup}
        onClose={() => {
          setShowSkillGroupModal(false);
          setSelectedSkillGroup(null);
        }}
        onSave={handleSaveSkillGroup}
        isSubmitting={isSkillGroupSubmitting}
      />

      <ResumeSkillModal
        show={showSkillModal}
        skill={selectedSkill}
        skillGroups={skillGroups}
        defaultGroup={selectedSkillDefaultGroup}
        onClose={() => {
          setShowSkillModal(false);
          setSelectedSkill(null);
          setSelectedSkillDefaultGroup(null);
        }}
        onSave={handleSaveSkill}
        isSubmitting={isSkillSubmitting}
      />

      <ResumeAwardModal
        show={showAwardModal}
        award={selectedAward}
        onClose={() => {
          setShowAwardModal(false);
          setSelectedAward(null);
        }}
        onSave={handleSaveAward}
        isSubmitting={isAwardSubmitting}
      />
    </>
  );
}

export default Resume;
