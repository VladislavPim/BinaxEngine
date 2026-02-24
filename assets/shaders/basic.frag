#version 330 core
out vec4 FragColor;

in vec3 FragPos;
in vec2 TexCoords;
in mat3 TBN;

uniform sampler2D diffuseTexture;
uniform sampler2D normalMap;
uniform bool hasDiffuseTexture;
uniform bool hasNormalMap;
uniform vec3 objectColor;

uniform float metallic;        // 0 - диэлектрик, 1 - металл
uniform float roughness;       // 0 - гладкий, 1 - матовый
uniform float ao;              // ambient occlusion (пока не используем)

uniform float normalStrength;
uniform vec2 uvScale;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform float lightIntensity;
uniform vec3 viewPos;

void main() {
    vec2 uv = TexCoords * uvScale;

    // Альбедо
    vec3 albedo;
    if (hasDiffuseTexture) {
        albedo = texture(diffuseTexture, uv).rgb;
    } else {
        albedo = objectColor;
    }

    // Нормаль
    vec3 normal;
    if (hasNormalMap) {
        normal = texture(normalMap, uv).rgb;
        normal = normalize(normal * 2.0 - 1.0);
        // Усиление нормалей (смешиваем с геометрической нормалью)
        vec3 geomNormal = normalize(TBN[2]);
        normal = normalize(mix(geomNormal, normal, normalStrength));
        normal = normalize(TBN * normal);
    } else {
        normal = normalize(TBN[2]);
    }

    // Параметры освещения
    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);

    // Диффузная составляющая (Lambert)
    float diff = max(dot(normal, lightDir), 0.0);

    // Блик (Specular) - roughness влияет на shininess
    float shininess = mix(256.0, 2.0, roughness); // от очень гладкого до матового
    float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);

    // Для металлов блик окрашен в цвет альбедо, для диэлектриков - белый
    vec3 specColor = mix(vec3(1.0), albedo, metallic);

    vec3 ambient = 0.1 * albedo;
    vec3 diffuse = diff * albedo * lightColor * lightIntensity;
    vec3 specular = spec * specColor * lightColor * lightIntensity;

    vec3 result = ambient + diffuse + specular;
    FragColor = vec4(result, 1.0);
}