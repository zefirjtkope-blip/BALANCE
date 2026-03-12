import React, { useState } from "react";
import ScrollablePage from "./ScrollablePage";
import { FaUser, FaEdit, FaCrown, FaChartLine, FaTrashAlt, FaCamera } from "react-icons/fa";

const Settings = ({
  userProfile,
  isSubscribed,
  calorieData,
  onProfileUpdate,
  onSubscribe,
  onReset,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userProfile });

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...userProfile });
    setIsEditing(false);
  };

  const handleSubscribe = () => {
    if (window.Telegram?.WebApp?.showPopup) {
      window.Telegram.WebApp.showPopup(
        {
          title: "BALANCE Premium",
          message: "Расширенная аналитика, отчёты и синхронизация за 299₽/мес",
          buttons: [
            { id: "subscribe", type: "default", text: "Подписаться" },
            { id: "cancel", type: "cancel", text: "Отмена" },
          ],
        },
        (buttonId) => {
          if (buttonId === "subscribe") {
            onSubscribe();
            window.Telegram.WebApp.showAlert("Подписка оформлена! 🎉");
          }
        }
      );
    } else {
      onSubscribe();
    }
  };

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: "Недостаточный вес", color: "#4dabf7" };
    if (bmi < 25) return { text: "Нормальный вес", color: "#51cf66" };
    if (bmi < 30) return { text: "Избыточный вес", color: "#ff922b" };
    return { text: "Ожирение", color: "#ff6b6b" };
  };

  const bmi = calculateBMI(userProfile.weight, userProfile.height);
  const bmiCategory = getBMICategory(bmi);

  const initials = userProfile.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <ScrollablePage>
      <div style={{ backgroundColor: "#0a0a0a", minHeight: "100%", color: "#fff", paddingBottom: 20 }}>
        {/* Аватар и имя */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: "linear-gradient(135deg, #4dabf7, #1864ab)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 600,
                color: "#fff",
                marginBottom: 12,
              }}
            >
              {initials}
            </div>
            {isEditing && (
              <button
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "#4dabf7",
                  border: "2px solid #0a0a0a",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                }}
                onClick={() => alert("Функция смены аватара будет добавлена позже")}
              >
                <FaCamera size={14} />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.name || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
              style={{
                fontSize: 24,
                fontWeight: 700,
                textAlign: "center",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #2a2a2a",
                color: "#fff",
                padding: "4px 0",
                marginTop: 4,
                width: "200px",
                outline: "none",
              }}
              placeholder="Ваше имя"
            />
          ) : (
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, textAlign: "center" }}>
              {userProfile.name || "Пользователь"}
            </h1>
          )}
          <p style={{ fontSize: 14, color: "#888", marginTop: 4, textAlign: "center" }}>
            {isSubscribed ? (
              <span style={{ color: "#51cf66" }}>⚡ Premium</span>
            ) : (
              <span>Бесплатный аккаунт</span>
            )}
          </p>
        </div>

        {/* Карточка профиля */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            border: "1px solid #2a2a2a",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <FaUser color="#4dabf7" /> Профиль
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#4dabf7",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                <FaEdit />
              </button>
            )}
          </div>

          {isEditing ? (
            // Режим редактирования — минималистичные поля
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>Пол</span>
                  <select
                    value={editedProfile.gender}
                    onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "right",
                      outline: "none",
                    }}
                  >
                    <option value="male" style={{ background: "#1a1a1a" }}>Мужской</option>
                    <option value="female" style={{ background: "#1a1a1a" }}>Женский</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>Возраст</span>
                  <input
                    type="number"
                    value={editedProfile.age}
                    onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "right",
                      width: "60px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>Рост</span>
                  <input
                    type="number"
                    value={editedProfile.height}
                    onChange={(e) => setEditedProfile({ ...editedProfile, height: parseInt(e.target.value) })}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "right",
                      width: "60px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>Вес</span>
                  <input
                    type="number"
                    value={editedProfile.weight}
                    onChange={(e) => setEditedProfile({ ...editedProfile, weight: parseInt(e.target.value) })}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "right",
                      width: "60px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>Активность</span>
                  <select
                    value={editedProfile.activity}
                    onChange={(e) => setEditedProfile({ ...editedProfile, activity: e.target.value })}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "right",
                      outline: "none",
                    }}
                  >
                    <option value="sedentary" style={{ background: "#1a1a1a" }}>Малоподвижный</option>
                    <option value="light" style={{ background: "#1a1a1a" }}>Легкая активность</option>
                    <option value="moderate" style={{ background: "#1a1a1a" }}>Умеренная активность</option>
                    <option value="active" style={{ background: "#1a1a1a" }}>Высокая активность</option>
                    <option value="very_active" style={{ background: "#1a1a1a" }}>Очень высокая активность</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>Цель</span>
                  <select
                    value={editedProfile.goal}
                    onChange={(e) => setEditedProfile({ ...editedProfile, goal: e.target.value })}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: 16,
                      textAlign: "right",
                      outline: "none",
                    }}
                  >
                    <option value="lose" style={{ background: "#1a1a1a" }}>Похудение</option>
                    <option value="maintain" style={{ background: "#1a1a1a" }}>Поддержание</option>
                    <option value="gain" style={{ background: "#1a1a1a" }}>Набор массы</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: "#4dabf7",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid #2a2a2a",
                    background: "transparent",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            // Режим просмотра — компактная сетка
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Пол</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {userProfile.gender === "male" ? "Мужской" : "Женский"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Возраст</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{userProfile.age} лет</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Рост</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{userProfile.height} см</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Вес</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{userProfile.weight} кг</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Уровень активности</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {calorieData?.activity?.label || "Не указана"}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Цель</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {calorieData?.goal?.label || "Сохранение веса"}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>ИМТ</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: bmiCategory.color }}>{bmi.toFixed(1)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Категория</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: bmiCategory.color }}>
                    {bmiCategory.text}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Остальные блоки (подписка, прочее, сброс) без изменений */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            border: "1px solid #2a2a2a",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <FaCrown color="#ffd43b" /> Подписка
          </h3>
          {isSubscribed ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#51cf66" }}>Premium активна</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#0a0a0a", padding: 12, borderRadius: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>📊 Аналитика</span>
                </div>
                <div style={{ background: "#0a0a0a", padding: 12, borderRadius: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>📈 Отчёты</span>
                </div>
                <div style={{ background: "#0a0a0a", padding: 12, borderRadius: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 14, color: "#888" }}>☁️ Синхронизация</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 16 }}>
                Расширенная аналитика, подробные отчёты и синхронизация данных.
              </p>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>299₽</span>
                <span style={{ fontSize: 14, color: "#888", marginLeft: 4 }}>/мес</span>
              </div>
              <button
                onClick={handleSubscribe}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #4dabf7, #1864ab)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Подписаться
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#1a1a1a",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            border: "1px solid #2a2a2a",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>🔧 Прочее</h3>
          <button
            onClick={() => onNavigate("history")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "1px solid #2a2a2a",
              background: "transparent",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <FaChartLine color="#4dabf7" />
              <span>История питания</span>
            </div>
            <span style={{ color: "#888" }}>›</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Все данные будут удалены безвозвратно.")) onReset();
          }}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "1px solid #ff6b6b",
            background: "transparent",
            color: "#ff6b6b",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <FaTrashAlt /> Сбросить все данные
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 20 }}>
          BALANCE v1.0.0
        </p>
      </div>
    </ScrollablePage>
  );
};

export default Settings;