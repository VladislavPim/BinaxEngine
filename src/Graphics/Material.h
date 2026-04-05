#pragma once
#include <string>
#include <GL/glew.h>
#include <glm/glm.hpp>

class Material {
public:
    Material();
    ~Material();

    bool LoadDiffuseTexture(const std::string& path);
    bool LoadNormalTexture(const std::string& path);
    bool LoadRoughnessTexture(const std::string& path);
    bool LoadMetallicTexture(const std::string& path);
    bool LoadAOTexture(const std::string& path);
   
    // Очистка текстур
void ClearDiffuse()   { if (m_DiffuseTexture)   { glDeleteTextures(1, &m_DiffuseTexture);   m_DiffuseTexture = 0; } }
void ClearNormal()    { if (m_NormalTexture)    { glDeleteTextures(1, &m_NormalTexture);     m_NormalTexture = 0; } }
void ClearRoughness() { if (m_RoughnessTexture) { glDeleteTextures(1, &m_RoughnessTexture); m_RoughnessTexture = 0; } }
void ClearMetallic()  { if (m_MetallicTexture)  { glDeleteTextures(1, &m_MetallicTexture);   m_MetallicTexture = 0; } }
void ClearAO()        { if (m_AOTexture)        { glDeleteTextures(1, &m_AOTexture);         m_AOTexture = 0; } }

    void BindTextures() const;
    void UnbindTextures() const;

    bool HasDiffuse() const { return m_DiffuseTexture != 0; }
    bool HasNormal() const  { return m_NormalTexture != 0; }
    bool HasRoughness() const { return m_RoughnessTexture != 0; }
    bool HasMetallic() const { return m_MetallicTexture != 0; }
    bool HasAO() const { return m_AOTexture != 0; }

    glm::vec3 albedo = glm::vec3(1.0f);
    float metallic = 0.0f;
    float roughness = 0.5f;
    float ao = 1.0f;

    glm::vec2 uvScale = glm::vec2(1.0f);
    float normalStrength = 1.0f;
    bool useWorldUV = false;

    glm::vec3 emissionColor = glm::vec3(0.0f);
    float emissionIntensity = 0.0f;

    void SetEmission(const glm::vec3& color, float intensity) {
        emissionColor = color;
        emissionIntensity = intensity;
    }

private:
    GLuint m_DiffuseTexture = 0;
    GLuint m_NormalTexture = 0;
    GLuint m_RoughnessTexture = 0;
    GLuint m_MetallicTexture = 0;
    GLuint m_AOTexture = 0;

    GLuint LoadTexture(const std::string& path);
};
