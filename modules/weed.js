module.exports.details = {
    name: "weed",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
if not file.Exists("emodules/weed.png","DATA") then 
    http.Fetch( "https://i.imgur.com/ZUS33eT.png",
	function( body, length, headers, code )
        file.Write("emodules/weed.png",body)
	end,
	function( message )
		print("emodules : erreur de recuperation de l'image, erreur : "..message)
	end)
end
local weed = Material( "data/emodules/weed.png")
local t = emodules.new()

t.name = "Weed"
t.desc = "Permet de voir le niveau des pots de weeds\\n(si vous êtes policier vous ne verrez rien)"

function t:onStart()
    hook.Add("PostDrawOpaqueRenderables", "emodules:weed:!", function()
        for k,v in ipairs(ents.FindByClass("srp_pot")) do 
            local angle = LocalPlayer():EyeAngles()
            angle = Angle( 0, angle.y, 0 )
            angle:RotateAroundAxis( angle:Forward(), 90)
            angle:RotateAroundAxis( angle:Right(), 90)

            local pos = v:LocalToWorld(Vector(0,0,60))
        
            cam.Start3D2D( pos, angle, 0.1 )  
                if LocalPlayer():GetPos():DistToSqr(v:GetPos()) > 100000 then goto next end
                if SimpleRP.isPoliceJob(SimpleRP.getJobIdFromTeamId(LocalPlayer():Team())) then goto next end
                if v:GetModel() == "models/nater/weedplant_pot_planted.mdl" or v:GetModel() == "models/nater/weedplant_pot_growing1.mdl" or  v:GetModel() == "models/nater/weedplant_pot_growing2.mdl"   then 
                    surface.SetMaterial( weed )
                    surface.SetDrawColor( 255, 7, 7)
                    surface.DrawTexturedRect( -65,0, 128, 128 )
                end
                if v:GetModel() == "models/nater/weedplant_pot_growing3.mdl" or  v:GetModel() == "models/nater/weedplant_pot_growing4.mdl" or  v:GetModel() == "models/nater/weedplant_pot_growing5.mdl"   then 
                    surface.SetMaterial( weed )
                    surface.SetDrawColor( 209, 133, 20)
                    surface.DrawTexturedRect( -65,0, 128, 128 )
                end
                if v:GetModel() == "models/nater/weedplant_pot_growing6.mdl" then 
                    surface.SetMaterial( weed )
                    surface.SetDrawColor( 203, 214, 40)
                    surface.DrawTexturedRect( -65,0, 128, 128 )
                end
                if v:GetModel() == "models/nater/weedplant_pot_growing7.mdl" then 
                    surface.SetMaterial( weed )
                    surface.SetDrawColor( 15, 236, 52)
                    surface.DrawTexturedRect( -65,0, 128, 128 )
                end
                ::next::
            cam.End3D2D()
        end
    end )
end
function t:onStop()
   hook.Remove( "PostDrawOpaqueRenderables", "emodules:weed:!")
end

t:End()

`