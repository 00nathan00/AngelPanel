module.exports.details = {
    name: "drugcount",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
local t = emodules.new()

t.name = "DrugCount"
t.desc = "Voir le nombre de champignons au sol \\navec /count et le nombre de drogue sur vous avec /drogue"

local dpos = 0
local dradius = 150
local dtime = 0
function t:onStart()
    hook.Add( "PostDrawTranslucentRenderables", "emodules:drugsphere", function()
        if dtime < CurTime() then return end
        render.SetColorMaterial()

        local wideSteps = 10
        local tallSteps = 10
    
        render.DrawWireframeSphere( dpos, dradius, dradius, dradius, Color( 255, 255, 255, 255 ) ,true)
    end)
    emodules:addCommand("Count",{
        commands = {"/count"},
        color = Color(122, 120, 85),
        onUse = function(text)
            local num = tonumber(text)
        
            if num then 
                if num > 200 then 
                    dradius = 200 
                else
                    dradius = num 
                end
            else 
                dradius = 150 
            end
            dpos = LocalPlayer():GetPos()

            srp_mushroom_total = 0
            srp_mushroom_nocturnal_total = 0
            srp_mushroom_weeping_total = 0
        
            
            for k, v in pairs(ents.FindInSphere(LocalPlayer():GetPos(), dradius)) do 
                if v:GetClass() == "srp_mushroom" then
                    srp_mushroom_total =  srp_mushroom_total + 1
                end 
                if v:GetClass() == "srp_mushroom_nocturnal" then
                    srp_mushroom_nocturnal_total =  srp_mushroom_nocturnal_total + 1
                end 
                if v:GetClass() == "srp_mushroom_weeping" then
                    srp_mushroom_weeping_total =  srp_mushroom_weeping_total + 1
                end 
            end
        
            dtime = CurTime() + 5

            SimpleRP.addChatMessage(emodules.id, nil, "Voici le nombre de champignons autour de vous :")
            SimpleRP.addChatMessage(emodules.id, nil, "Champignons Hallucinogènes : "..srp_mushroom_total)
            SimpleRP.addChatMessage(emodules.id, nil, "Champignons Nocturnes : "..srp_mushroom_nocturnal_total)
            SimpleRP.addChatMessage(emodules.id, nil, "Champignons Pleureux : "..srp_mushroom_weeping_total)
        end 
    })
    emodules:addCommand("Drogue",{
        commands = {"/drogue"},
        color = Color(122, 120, 85),
        onUse = function(text)
            local srp_cannabis_total = SimpleRP.getItemCount("srp_cannabis") * 60
            local srp_mushroom_total = SimpleRP.getItemCount("srp_mushroom") * 110
            local srp_mushroom_nocturnal_total = SimpleRP.getItemCount("srp_mushroom_nocturnal") * 200
            local srp_mushroom_weeping_total = SimpleRP.getItemCount("srp_mushroom_weeping") * 200
            local srp_alcohol_total = SimpleRP.getItemCount("srp_alcohol") * 800

            SimpleRP.addChatMessage(43, nil, "Valeur de votre drogue en Euros : ")
            SimpleRP.addChatMessage(1, nil, SimpleRP.getItemCount("srp_cannabis") .. " Pochons de cannabis = " .. srp_cannabis_total .. "€")
            SimpleRP.addChatMessage(1, nil, SimpleRP.getItemCount("srp_mushroom") .. " Champignons Hallucinogènes = " .. srp_mushroom_total .. "€")
            SimpleRP.addChatMessage(1, nil, SimpleRP.getItemCount("srp_mushroom_nocturnal") .. " Champignons Nocturnes = " .. srp_mushroom_nocturnal_total .. "€")
            SimpleRP.addChatMessage(1, nil, SimpleRP.getItemCount("srp_mushroom_weeping") .. " Champignons Pleureux = " .. srp_mushroom_weeping_total .. "€")
            SimpleRP.addChatMessage(1, nil, SimpleRP.getItemCount("srp_alcohol") .. " Bouteilles d'Alcool = " .. srp_alcohol_total .. "€")
            SimpleRP.addChatMessage(1, nil, "Valeur Totale = " ..  srp_cannabis_total + srp_mushroom_total + srp_mushroom_nocturnal_total + srp_mushroom_weeping_total + srp_alcohol_total .. "€")
        end
    })
end
function t:onStop()
    hook.Remove("PostDrawTranslucentRenderables", "emodules:drugsphere")    
    emodules:removeCommand("Drogue")
    emodules:removeCommand("Count")
end

t:End()

`