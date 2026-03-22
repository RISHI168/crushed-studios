# Crushed Studios — File Extraction Map (v6.1)
**When this monolith JSX is decomposed into a real repo, here is where each region goes.**

## /src/constants/
| File | Region | Contents |
|------|--------|----------|
| tokens.js | 1 | T color tokens, font aliases (D/B/M), ACCENT |
| scene-status.js | 1 | SCENE_STATUS, STATUS_FLOW |
| camera-options.js | 1 | CAMERA_BODIES, LENS_TYPES, FILM_STOCKS, ASPECT_RATIOS, FOCAL_LENGTHS, SHOT_TYPES, CAMERA_MOVEMENTS, LIGHTING_STYLES, ATMOSPHERE_MOODS |
| agents.js | 2 | AGENTS array (7 pipeline agents) |
| auth.js | 2f | ROLES (5 roles with .can permission matrix), CREDIT_COSTS |

## /src/data/
| File | Region | Contents |
|------|--------|----------|
| seed.js | 3 | initBible(), initChars(), initScenes(), initScreenplay() |
| team-seed.js | 2f | TEAM_SEED, USERS_SEED (4 demo users) |
| projects-seed.js | 2f | PROJECTS_SEED (4 projects), PROJECT_TEMPLATES (5 templates) |
| project-data-store.js | 2f | projectDataStore initial data (Monsoon, Raga, Neon) |

## /src/components/shared/
| File | Region | Contents |
|------|--------|----------|
| SectionHeader.jsx | 4a | SH component (icon, title, tip tooltip, right slot) |
| TagSelect.jsx | 4b | TagSelect dropdown (label, value, options, onChange, color) |
| StatusBadge.jsx | 4c | StatusBadge pill (icon + label + color per status) |
| StatusPipeline.jsx | 4d | StatusPipeline (clickable status flow with role-based gates) |
| PromptPreview.jsx | 4e | PromptPreview (6-layer prompt assembly with token bar) |
| Notification.jsx | 4f | Toast notification component |
| ConfirmModal.jsx | — | confirmAction modal (blurred backdrop, Cancel/Confirm) |

## /src/components/dashboard/
| File | Contents |
|------|----------|
| ProjectDashboard.jsx | Dashboard view: project grid, search, filters |
| ProjectCard.jsx | Individual project card with progress bar, collaborators, actions |
| NewProjectModal.jsx | Create project dialog with template picker |

## /src/components/header/
| File | Contents |
|------|----------|
| Header.jsx | Sticky header bar with nav, badges, menus |
| TeamPresence.jsx | Overlapping avatar circles with online dots |
| CreditBadge.jsx | Gold credit balance pill |
| NotificationBell.jsx | Bell icon + unread badge + feed dropdown |
| ProjectMenu.jsx | Export/Import/Reset dropdown |
| UserMenu.jsx | User avatar + role switcher + team info + role legend |

## /src/components/screenplay/
| File | Region | Contents |
|------|--------|----------|
| ScreenplayView.jsx | 5 | Full screenplay view container |
| SceneEditor.jsx | 5 | Per-scene screenplay editor (fields, dialogue blocks) |
| SceneTimeline.jsx | 5 | Horizontal scene card navigator |
| ActStructure.jsx | 5 | Act editor with drag handles |
| GenerationReadiness.jsx | 5 | Scene readiness checklist |
| SceneComments.jsx | 2.4 | Threaded comment system with @-mentions |
| AuditTrail.jsx | 2.4 | Status change history per scene |
| VersionHistory.jsx | 2.5 | Version snapshots with diff timeline and restore |

## /src/components/console/
| File | Region | Contents |
|------|--------|----------|
| ConsoleView.jsx | 6 | Full console view container |
| ProductionBible.jsx | 6 | Bible parameter grid (genre, camera, grade) |
| SceneCamera.jsx | 6 | Per-scene camera/lighting/atmosphere |
| CharacterInScene.jsx | 6 | Character cards with emotion/wardrobe/blocking |
| StoryboardPanel.jsx | 6 | Storyboard grid with approve/reject/regen/delete |
| GenerateButton.jsx | 6 | Generate Scene button with readiness checks + credit guard |
| AgentFeed.jsx | 6 | 7-agent staged generation progress |
| ContinuityContext.jsx | 0.2 | Carry-forward analysis panel |
| PromptAssembly.jsx | 0.1 | 6-layer prompt preview with token counts |

## /src/components/characters/
| File | Contents |
|------|----------|
| CharacterBible.jsx | Character grid with identity cards, LoRA status |

## /src/components/continuity/
| File | Contents |
|------|----------|
| ContinuityTracker.jsx | Cross-scene character diff matrix |

## /src/components/review/
| File | Region | Contents |
|------|--------|----------|
| ReviewView.jsx | 7 | Full review view container |
| StoryboardComparison.jsx | 7 | Panel vs generated frame grid |
| ValidationChecklist.jsx | 7 | 8-point post-generation validation |
| ScriptSync.jsx | 7 | Screenplay text synced to playhead |
| AnnotationLayer.jsx | 7 | Timestamped annotations with add/resolve |
| TakeHistory.jsx | 7 | Take list with approve/reject |

## /src/components/audio/
| File | Region | Contents |
|------|--------|----------|
| AudioMixer.jsx | 8 | 4-track mixer with generate/regen + credit guard |
| WaveformTrack.jsx | 8 | Per-track waveform with mute/solo/volume |
| MasterVolume.jsx | 8 | Master volume slider |

## /src/components/timeline/
| File | Region | Contents |
|------|--------|----------|
| TimelineView.jsx | 9 | Full NLE view container |
| FilmstripTrack.jsx | 9 | Multi-segment filmstrip clips with viewport culling |
| AudioTracks.jsx | 9 | 4 audio tracks + text track with waveforms |
| ClipInspector.jsx | 9 | Selected clip metadata panel |
| AssemblySummary.jsx | 9 | Per-act scene summary with progress |
| TransportBar.jsx | 9 | Playhead, zoom, render quality controls |

## /src/hooks/
| File | Contents |
|------|----------|
| useGeneration.js | generateVideo, clearGeneration, generateStoryboard, staged pipeline |
| useStoryboard.js | Panel CRUD, approve/reject, regenerate, reorder |
| useAudio.js | Track generate, mix controls, master volume |
| usePersistence.js | Export/import project JSON |
| useCredits.js | deductCredits, cost table, balance checks |
| useAuth.js | currentUser, currentRole, permission helpers |
| useNotifications.js | pushNotif, appNotifs state |
| useComments.js | addComment, resolveComment, sceneComments state |
| useAudit.js | logAudit, auditLog state |
| useVersionControl.js | createVersion, restoreVersion, versionHistory state |
| useProjectManager.js | openProject, createProject, duplicateProject, archive, delete |

## /src/utils/
| File | Contents |
|------|----------|
| prompt-assembler.js | assemblePrompt (6-layer constraint assembly) |
| carry-forward.js | getCarryForward (cross-scene character diff analysis) |
| validation.js | validateAllScenes, per-scene issue detection |
| storyboard-stats.js | getStoryboardStats (panel/approval counts) |

**Total extraction targets: ~50 files from 1 monolith JSX**
